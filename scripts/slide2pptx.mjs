#!/usr/bin/env node
/**
 * Reveal.js (Quarto) スライドを PPTX に変換する．
 *
 * 仕組み:
 *   1. ローカルの quarto preview に `?print-pdf` で接続し，各 .pdf-page を
 *      1600x900 PNG としてキャプチャ
 *   2. 同時に各スライド内のテキスト要素 (h*, p, li など) の座標を抽出
 *   3. PPTX を組み立てる際，テキストを先に置いてから PNG を上に重ねる
 *      → 視覚的には PNG (= ブラウザでの見た目そのまま)
 *      → PPT の検索・コピー操作はテキスト層に到達するため機能する
 *
 * 使い方:
 *   node scripts/slide2pptx.mjs <deck-path> <output.pptx> [--port 4444] [--url URL]
 *
 *   <deck-path>   : posts/<slug> 形式のデッキ (例: posts/2026-04-13-claude-code-101)
 *   <output.pptx> : 出力ファイル
 *   --port        : quarto preview のポート (デフォルト 4444)
 *   --url         : フル URL を直接指定 (deck-path より優先)
 *
 * 例:
 *   node scripts/slide2pptx.mjs posts/2026-04-13-claude-code-101 deck.pptx
 *   node scripts/slide2pptx.mjs --port 4201 posts/2026-04-15-claude-code-with-claude-md md.pptx
 *
 * 前提:
 *   `quarto preview` が起動済みで，対象デッキに HTTP でアクセスできること．
 */

import { chromium } from 'playwright';
import pptxgen from 'pptxgenjs';
import path from 'path';
import process from 'process';

// ---- arg parse -----------------------------------------------------------
const argv = process.argv.slice(2);
let port = 4444;
let urlOverride = null;
const positional = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--port') { port = Number(argv[++i]); continue; }
  if (a === '--url') { urlOverride = argv[++i]; continue; }
  if (a === '-h' || a === '--help') {
    console.log(`Usage: node scripts/slide2pptx.mjs <deck-path> <output.pptx> [--port N] [--url URL]`);
    process.exit(0);
  }
  positional.push(a);
}

if (positional.length < 2 && !urlOverride) {
  console.error('Error: <deck-path> and <output.pptx> are required.');
  console.error('Usage: node scripts/slide2pptx.mjs <deck-path> <output.pptx> [--port N]');
  process.exit(1);
}

const outputPath = positional[positional.length - 1];
const deckPath = positional[0];
const url = urlOverride
  ?? `http://localhost:${port}/${deckPath.replace(/^\/|\/$/g, '')}/?print-pdf`;

// ---- canvas / slide dimensions ------------------------------------------
const CANVAS_W = 1600;       // _slide.yml width
const CANVAS_H = 900;        // _slide.yml height
const SLIDE_W_IN = 13.333;   // 16:9 PPT canvas (inches)
const SLIDE_H_IN = 7.5;

// ---- helpers -------------------------------------------------------------
const pxToInX = px => (px / CANVAS_W) * SLIDE_W_IN;
const pxToInY = px => (px / CANVAS_H) * SLIDE_H_IN;

// ---- main ----------------------------------------------------------------
console.log(`Loading: ${url}`);
// Use a viewport wider/taller than the canvas so the pdf-page (slightly wider
// than 1600 due to slide-background bleed) fits without horizontal scroll.
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();

const errors = [];
page.on('pageerror', e => errors.push(e.message));

await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
// 余裕を持って動的レンダラ (Vuetify, AnyChart, MathJax) の完了を待つ
await page.waitForTimeout(3000);

const slideCount = await page.locator('.pdf-page').count();
if (slideCount === 0) {
  console.error('Error: .pdf-page elements not found. Is the deck served at the given URL with ?print-pdf?');
  process.exit(2);
}
console.log(`Found ${slideCount} slides. Capturing...`);

const pres = new pptxgen();
pres.defineLayout({ name: 'CUSTOM_16x9', width: SLIDE_W_IN, height: SLIDE_H_IN });
pres.layout = 'CUSTOM_16x9';

for (let i = 0; i < slideCount; i++) {
  const pdfPage = page.locator('.pdf-page').nth(i);
  // The actual slide content is the inner <section>, not the pdf-page wrapper
  // (the wrapper has slide-background bleed and pdfPageHeightOffset padding).
  // Title slide uses .quarto-title-block, regular slides use .slide.
  const section = pdfPage.locator('section').first();

  // (a) screenshot the section, clipped to the canonical 1600×900 canvas.
  //     Section can be slightly taller (~989px) due to Reveal's
  //     pdfPageHeightOffset; we drop the bottom ~89px which is empty padding.
  await section.evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.waitForTimeout(150);
  const sectBox = await section.boundingBox();
  if (!sectBox) {
    console.warn(`  slide ${i + 1}: section bounding box unavailable, skipping`);
    continue;
  }
  const buf = await page.screenshot({
    type: 'png',
    clip: { x: sectBox.x, y: sectBox.y, width: CANVAS_W, height: CANVAS_H },
  });
  const dataUrl = `data:image/png;base64,${buf.toString('base64')}`;

  // (b) text extraction relative to the section (canonical 1600×900 box)
  const texts = await section.evaluate(el => {
    const r0 = el.getBoundingClientRect();
    const sectTop = r0.top;
    const sectLeft = r0.left;
    const sectW = 1600;
    const sectH = 900;

    const TEXT_TAGS = new Set(['H1','H2','H3','H4','P','LI','BLOCKQUOTE','TD','TH','SPAN']);
    const isContainerOf = (parent, child) => parent !== child && parent.contains(child);

    const candidates = [];
    el.querySelectorAll('h1,h2,h3,h4,p,li,blockquote,td,th,span').forEach(node => {
      // Skip inside vector-rendered areas (chart libraries / SVG glyphs)
      if (node.closest('svg, canvas, .anychart-container, .vuetify-timeline-container')) return;
      // Skip if hidden
      const cs = getComputedStyle(node);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      // Skip span-only-with-children (we'll get parent instead) — keep span only if it has direct text
      if (node.tagName === 'SPAN') {
        const hasDirectText = [...node.childNodes].some(n => n.nodeType === 3 && n.nodeValue.trim().length > 0);
        if (!hasDirectText) return;
      }
      // Skip if it has a nested text-tag descendant (we want leaf-level text containers)
      let hasNestedTextTag = false;
      for (const desc of node.querySelectorAll('h1,h2,h3,h4,p,li,blockquote,td,th')) {
        if (isContainerOf(node, desc)) { hasNestedTextTag = true; break; }
      }
      if (hasNestedTextTag) return;
      const text = node.innerText?.trim();
      if (!text || text.length < 1) return;
      const r = node.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      // Coords relative to the pdf-page section (0..1 normalized)
      const nx = (r.left - sectLeft) / sectW;
      const ny = (r.top - sectTop) / sectH;
      const nw = r.width / sectW;
      const nh = r.height / sectH;
      // Drop wholly out-of-bounds elements
      if (nx > 1 || ny > 1 || nx + nw < 0 || ny + nh < 0) return;
      candidates.push({
        text: text.slice(0, 600),  // cap absurdly long blocks
        nx, ny, nw, nh,
        fontSizePx: parseFloat(cs.fontSize) || 16,
        bold: cs.fontWeight === 'bold' || parseInt(cs.fontWeight, 10) >= 600,
      });
    });
    return candidates;
  });

  const slide = pres.addSlide();

  // (c) text layer FIRST (z-bottom) — so the PNG above hides it visually
  //     while keeping it copy/search-friendly in PowerPoint
  for (const t of texts) {
    slide.addText(t.text, {
      x: t.nx * SLIDE_W_IN,
      y: t.ny * SLIDE_H_IN,
      w: Math.max(0.1, t.nw * SLIDE_W_IN),
      h: Math.max(0.1, t.nh * SLIDE_H_IN),
      fontSize: Math.max(6, t.fontSizePx * 0.75),  // px→pt approx
      fontFace: 'Meiryo',
      color: '888888',
      bold: t.bold,
      margin: 0,
      isTextBox: true,
    });
  }

  // (d) full-bleed image on top (z-top)
  slide.addImage({ data: dataUrl, x: 0, y: 0, w: SLIDE_W_IN, h: SLIDE_H_IN });

  process.stdout.write(`  slide ${i + 1}/${slideCount} (texts: ${texts.length})\r`);
}

await browser.close();
console.log(`\nWriting ${outputPath}...`);
await pres.writeFile({ fileName: outputPath });
console.log(`✅ ${outputPath}`);
if (errors.length) {
  console.log(`⚠ Page errors during capture (visual may still be OK):`);
  errors.forEach(e => console.log(`  - ${e.slice(0, 120)}`));
}
