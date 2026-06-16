# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A Quarto website that compiles a collection of Reveal.js slide decks (one deck per directory under `posts/`) and publishes them to GitHub Pages at `https://ryonakagami.github.io/regmonkey-presentation`. The landing page (`index.qmd`) is a Quarto `listing:` of those decks. This is a content/authoring repository — there is no app code to test.

## Common commands

```bash
# Live preview at http://localhost:4201 (port fixed in _quarto.yml)
quarto preview

# Render the entire site into _site/ (also publishes via GitHub Actions on push to main)
quarto render

# Render just one deck while iterating
quarto render posts/<YYYY-MM-DD-slug>/index.qmd

# Export a rendered deck to PDF (requires preview server already running on the configured port,
# Chrome installed, and decktape on PATH)
./reveal2pdf.sh posts/<YYYY-MM-DD-slug> output.pdf
./reveal2pdf.sh --compress posts/<YYYY-MM-DD-slug> output.pdf   # post-process to <1MB via Ghostscript

# Export a rendered deck to PPTX (requires preview server on port 4444 by default;
# run `npm install` once to pull playwright + pptxgenjs)
./slide2pptx.sh posts/<YYYY-MM-DD-slug> output.pptx
./slide2pptx.sh --port 4201 posts/<YYYY-MM-DD-slug> output.pptx
```

`slide2pptx.sh` (and the underlying `scripts/slide2pptx.mjs`) captures each slide as a 1600×900 PNG via Playwright + Reveal's `?print-pdf` mode and embeds them full-bleed into a 16:9 PPTX. Searchable/copy-able text is laid down underneath the image so PowerPoint find + outline view still see the content. Trade-off: the visible content is an image, so text is not directly editable; for editable PPTX use Quarto's native `format: pptx` instead — which loses the custom CSS and shortcodes.

Python deps are managed by uv (`uv sync`). Python is only used for embedded code chunks — the site renders fine without executing them because `freeze: true` is set in `posts/_metadata.yml` (Quarto reuses cached outputs in `_freeze/`).

Publishing is automatic: pushes to `main` trigger `.github/workflows/publish.yml`, which runs `quarto render` and pushes `_site/` to the `gh-pages` branch.

## Architecture: how a slide deck is assembled

A `.qmd` under `posts/` does **not** carry its own Reveal.js config. The format is layered:

1. `_quarto.yml` (project root) — site-wide settings, but only its `format: html` block applies here. The `revealjs` settings live elsewhere.
2. `posts/_metadata.yml` — turns on `freeze: true` and pulls in `_slide.yml` via `metadata-files: [../_slide.yml]`. This is what makes posts render as slides instead of HTML pages.
3. `_slide.yml` (project root) — the actual Reveal.js config: 1600×900 canvas, Meiryo font, MathJax 3, slide-number, navigation mode, footer, plus a large `header-includes:` block that loads **all** the JS libraries every deck depends on (D3, AnyChart, Vuetify, leader-line, js-yaml, FontAwesome) **and** the project's own JS in `/js/`.
4. The deck's own YAML frontmatter — title/date/categories and a `filters:` list. **The `regmonkey_slide_editing` filter is required** for FontAwesome/Bootstrap shortcodes to work; omitting it makes `{{< fas ... >}}` render as literal text.

Because `_slide.yml` is shared, never set Reveal.js options (width, font, math, plugins) inside an individual post — change `_slide.yml` instead.

### The visual system lives in three places

- **`style/revealjs.css`** — 3000+ lines of named components. Every visual element on a slide (pentagon-box, square-box, info-box / success-box / warning-box / caution-box / danger-box, hop-step-jump, summary blocks, component-cards, mini-section, h2-submessage, border-bottom-headers, plus utility classes like `.font-09`–`.font-20`, `.lh-12`, `.padding-L-05`, `.width-110`, `.position-left-XX`, `.regmonkey-bold`, `.squaredmark`) is a class defined here. **Do not invent class names or write raw HTML/inline styles** — they will not match the rest of the site.
- **`_extensions/regmonkey_slide_editing/`** — this repo's own Quarto extension. `fasicons.lua` provides `{{< fas ... >}}` / `{{< bi ... >}}` shortcodes; `spanify.lua` is a Pandoc filter. Other extensions in `_extensions/` (`reveal_vspace`, `reveal_horizontalline`, `inject_anychart_js`, etc.) are the source of `{{< reveal_vspace 0.5em >}}` and similar shortcodes used throughout posts.
- **`js/`** — interactive components loaded globally via `_slide.yml` header-includes. Files like `regmonkey_vuetify_timeline.js`, `regmonkey_gantt_chart.js`, `yaml2table.js`, `regmonkey_yaml2grouptable.js`, `regmonkey_abstract_summary.js`, `regmonkey_index_summary.js` read inline YAML/JSON from a slide and render Vuetify/D3 components in place.

### Templates and the slide-authoring skill

There are two template locations and they are **complementary, not duplicates**:

- `template/` (repo root) — slide-level templates (concept-explanation, hop-step-jump, pentagon-squared-box, info-box-with-two-cols, lecture-index-slide, etc.).
- `.claude/skills/regmonkey-slide-skill/templates/` — additional templates (status-boxes, summary-yaml2table, info-box variants, yaml-frontmatter scaffold).

The companion skill at `.claude/skills/regmonkey-slide-skill/` (`SKILL.md` + `references/` + `subagents/`) is the canonical authoring guide. **Read `SKILL.md` before creating or editing any slide** — it documents the four core layout patterns (Pentagon × Square, Hop-Step-Jump, info-box + bullets, summary), the Quarto fence-div nesting rules (colon-count discipline), and the writing rules below. Detailed component/utility/pattern catalogs live in `references/`.

## Slide-authoring rules (enforced; not a style preference)

These come from `regmonkey-slide-skill/SKILL.md` and apply to every `.qmd` under `posts/`:

- **One message per slide.** The H2 (`##`) is the takeaway sentence, not a topic label. "MLflow導入によりモデル管理を自動化" — yes. "MLfowについて" — no.
- **MMUF (Main Message Up Front).** The conclusion goes in the H2; bullets justify it.
- **Do not use `/` as a list separator in Japanese prose.** Use `・` (e.g. `Python・SQL・R`) or `，`. Inside code/paths/URLs `/` is fine.
- **Prefer `：` over `—` (em-dash)** for explanation/listing in Japanese body text.
- **No hype words.** Avoid 驚くほど・劇的に・圧倒的に・魔法のように・革命的・完璧・究極・秒で・あっという間に・楽々. Replace with concrete numbers/structure (`劇的に高速化` → `処理時間が80%減`).
- **Use Quarto fence divs literally — never raw HTML.** `:::{.pentagon-box-500}` works; `<div class="pentagon-box-500">` defeats Quarto processing. Outer wrappers need *more* colons than inner ones; if nesting breaks, copy a template instead of patching.
- **Never set `font-family` on code blocks.** `_quarto.yml` sets `monofont: monospace` deliberately.
- **Pair contrast slides as Pentagon (left) × Square (right).** The pentagon's right-pointing arrow is the visual carrier of "problem → answer / AS-IS → TO-BE." Two squares break the metaphor.
- **H2 ideally ≤33 chars.** Move overflow into `[...]{.h2-submessage}` directly under the heading.

## Conventions worth knowing

- New posts go in `posts/YYYY-MM-DD-<slug>/index.qmd`. Quarto's listing on `index.qmd` picks them up automatically (sorted by date desc).
- `_freeze/` is committed (it caches Python execution output so the site builds without re-running notebooks). Do not delete it without a reason.
- `_site/`, `.quarto/`, `.venv/`, and `_freeze/` regeneration artifacts are gitignored where appropriate; `_freeze/` itself is **not** ignored on purpose.
- Diagrams should be authored as SVG (not PNG/JPG) using the house style: `stroke="#0E3666"`, `fill="none"` background, `fill="#1A1A1A"` text via a top-level `<style>`, `viewBox="0 0 1920 H"`. Full spec is in `.claude/skills/regmonkey-slide-skill/subagents/slide-svg-generator.md`.
- The PR template (`.github/pull_request_template.md`) is in Japanese and structured as Description / Changes / Example / Additional Notes / Related Issue. Match that style when opening PRs.

## When something doesn't render the way it should

Most failures are one of:
1. Missing `regmonkey_slide_editing` in the post's `filters:` (shortcodes appear as literal text).
2. Mismatched fence-div colon counts (Pandoc silently flattens nesting).
3. A class name that doesn't exist in `style/revealjs.css` (silently no-op — search the CSS before inventing names).
4. An H2 that overflows the 1600×900 canvas — body work area is only ~650px tall; if content overflows, *reduce density* before resizing fonts. The full overflow-triage checklist is in `.claude/skills/regmonkey-slide-skill/references/authoring-checks.md`.
