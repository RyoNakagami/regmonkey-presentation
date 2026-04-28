# Components reference

Every named component the repo's CSS supports. Group by purpose. Each entry shows the canonical fenced-div invocation and what it's for. When picking a component, **match against this table; do not invent class names** — undefined classes silently render unstyled.

## Table of contents

1. [Contrast & paired blocks](#contrast--paired-blocks) — pentagon-box, square-box
2. [Status / framed blocks](#status--framed-blocks) — info-box, def-block, success/warning/caution/danger-box, message-box
3. [Headers & dividers](#headers--dividers) — border-bottom-header(-left), mini-section, h2-submessage, section-header
4. [Stage / phase blocks](#stage--phase-blocks) — hop-step-jump, step-container, past-phase / active-phase
5. [Keypoint blocks](#keypoint-blocks) — vertical-keypoints, horizontal-keypoints
6. [Summary blocks](#summary-blocks) — summary-container, block-azureblue(-with-bg)
7. [Cards](#cards) — component-card, component-card-for-analysis-summary, component-card-index
8. [Grids & layouts](#grids--layouts) — tools-grid, tools-column, centered-column-wrapper
9. [List markers](#list-markers) — checkmark, checkmark_none, squaredmark, custom-list
10. [Tables](#tables) — custom-table(-no-header), yaml2table, yaml2grouptable
11. [Index slide](#index-slide) — regmonkey-index-slide(-no-title), sidebar
12. [Misc](#misc) — topleftbox, regmonkey-bold, border-bottom

---

## Contrast & paired blocks

These are the repo's signature for "課題 → 対応" / AS-IS → TO-BE. **Pentagon goes left**, with its right-pointing arrow visually delivering the problem into the **square on the right**, where the answer lives. Reversing the sides loses the meaning. Two squares for a contrast reads as "two parallel things", not as problem→answer.

| Class | Height | Notes |
|---|---|---|
| `.pentagon-box-400` | 400px | Compact; for slides with sparse content. |
| `.pentagon-box-500` | 500px | Default. Matches square-box-500. |
| `.pentagon-box-550` | 550px | When 500 is just barely too short. |
| `.pentagon-box-600` | 600px | High-density bullets. |
| `.pentagon-box-700` | 700px | Almost full slide; rare. |
| `.square-box-400` … `-700` | matching | Always pair with the same number. |

Internal structure: header div + body div. Header uses `.border-bottom-header-left`. Body uses `.squaredmark` (square bullet markers) — see [List markers](#list-markers).

```
::::{.pentagon-box-500}
:::{.border-bottom-header-left}
ヘッダー文言
:::
:::{.squaredmark style="font-size: 0.9em"}
- 1点目
- 2点目
:::
::::
```

The pentagon's arrow tip (rendered as an SVG `::after`) extends ~165px past the box. Don't put another column hard against the pentagon's right edge — leave the `width="50%"` columns alone and the arrow will fit.

---

## Status / framed blocks

All share the same internal anatomy: a 4px-wide colored bar on the left and pale tinted background. Pick by semantic.

| Class | Bar color | Background | Use for |
|---|---|---|---|
| `.info-box` | #428CE6 (blue) | #e8f1fe | Definitions, framing, neutral takeaways. The workhorse. |
| `.def-block` | #428CE6 (blue) | white | Mathematical / theoretical definitions. Use with `.def-title` and `.def-contents` inside. |
| `.success-box` | #1e8e3e (green) | #e6f4ea | Confirmation, "実現できること". |
| `.warning-box` | #f9ab00 (yellow) | #fef7e0 | Caveat, things to be aware of. |
| `.caution-box` | #e8710a (orange) | #fff3e0 | Stronger caution; gotchas. |
| `.danger-box` | #d93025 (red) | #fde8e8 | Hard "do not" — anti-patterns, errors. |
| `.message-box` | — | bordered | Plain bordered callout (no left bar). |
| `.message-box-no-border` | — | none | Plain block, padding only. |

Internal structure for `.info-box`:

```
:::{.info-box}
{{< reveal_vspace 0.25em >}}
:::{.info-contents .font-10 .padding-L-05 .lh-12}
- bullet 1
- bullet 2
:::
:::
```

For `.info-box` you can title it: put `[タイトル]{.info-box-title}` inside. **必須ルール:** `[...]{.info-box-title}` の行の[**上下に必ず空行**]を入れる．直前の `:::{.info-box}` フェンスや直後の `:::{.info-contents}` フェンスとくっつくと Pandoc が span として認識せず，タイトルが消える（または info-contents の中身に飲み込まれる）．番号付きの場合は `①②③④⑤⑥⑦⑧⑨⑩` を先頭に付ける．

```
:::{.info-box}

[① タイトル]{.info-box-title}

:::{.info-contents .font-10 .padding-L-05 .lh-12}
- bullet 1
- bullet 2
:::

:::
```

For `.def-block` the same blank-line rule applies to `[定義名]{.def-title}`:

```
:::: {.def-block style="font-size:1.2em;"}

[定義名]{.def-title}

::: {.def-contents}
- 定義の本文
:::

::::
```

`.success-box` / `.warning-box` / `.caution-box` / `.danger-box` mirror `.info-box` exactly — same `.info-contents`, `.info-box-title` work inside them too (同じ空行ルールが適用される)．

---

## Headers & dividers

| Class | Render | Use for |
|---|---|---|
| `.border-bottom-header` | Centered text with bottom border (97.5% width) | Headers inside boxes when centering reads better. |
| `.border-bottom-header-left` | Left-aligned text with bottom border | The default for box headers. Used inside pentagon/square boxes. |
| `.border-bottom` | Just a bottom border, applied as inline span via `[text]{.border-bottom}` | Section labels mid-slide. |
| `.section-header` | Bold section label | Top-of-slide subdivision marker. Auto-flattened into a span by the `regmonkey_slide_editing` filter. |
| `.mini-section` | Bold + ▶ prefix, inline | Sub-headings within a slide. Used as `[見出し]{.mini-section}`. |
| `.h2-submessage` | Large blue (#0e3666) text, 1.3em bold | Sub-message under the H2 title. Used as `[本文]{.h2-submessage}`. |

`.h2-submessage` pattern (very common at slide top):

```
## スライドタイトル

[一文で表現したサブメッセージ]{.h2-submessage}

{{< reveal_vspace 0.5em >}}
```

---

## Stage / phase blocks

### `.hop-step-jump-container`

Three-stage left-to-right progression with implied "→" between stages. Each child is a `.step` with a numbered class `.step-1` / `.step-2` / `.step-3` (these set color tones — earlier=lighter).

Internal structure:
```
:::::{.hop-step-jump-container}
::::{.step .step-1}
:::{.step-number}    <- typically a role/label
ジュニア
:::
:::{.step-title}     <- the verb-phrase that defines the stage
分析ができる
:::
:::{.info-content}   <- bullets describing the stage
- ...
:::
::::
... step 2, step 3 ...
:::::
```

`.hop-step-jump-container-vanilla` is the same layout without the colored decoration — use when you want a flat presentation of the same structure.

### `.step-container` / `.step` / `.past-phase` / `.active-phase`

Lower-level building blocks for custom phase visualizations. `.past-phase` and `.active-phase` render arrow-shaped phase pills with state indication (used in roadmap-style slides). Read the CSS at lines ~1152-1290 if you need to assemble a roadmap by hand; for most uses, `.hop-step-jump-container` is enough.

---

## Keypoint blocks

### `.vertical-keypoints-block`

Stacked-vertical layout, each child has `.block` (or `.no-border-block`) and a header (`.block-header` or `.block-header-centered`). Use when you have 3+ "key takeaway" items that need to read top-to-bottom.

```
:::{.vertical-keypoints-block}
:::{.block}
:::{.block-header}
{{< bi exclamation-circle-fill size=1.6em color=#428CE6 >}} 観点1
:::
- bullet
- bullet
:::
:::{.block .last-block}
... last item ...
:::
:::
```

### `.horizontal-keypoints-block` / `.horizontal-keypoints-block-no-border`

Same idea, laid out left-to-right inside a `.columns` row. Used for 3-column slides where each column is one keypoint. The `-no-border` variant drops the right-side separator (use for the last column).

```
::::: {.columns}
:::: {.column style="width: 33.3%; height:100%"}
:::{.horizontal-keypoints-block style="height:60%;"}
:::{.block-header}
{{< bi signpost size=1.7em color=#428CE6 >}} 観点1
:::
:::{.block .checkmark style="font-size:0.8em;"}
- 説明
:::
:::
::::
:::: {.column style="width: 33.3%; height:100%"}
... col 2 (also .horizontal-keypoints-block) ...
::::
:::: {.column style="width: 33.3%; height:100%"}
:::{.horizontal-keypoints-block-no-border style="height:60%;"}
... col 3, no right border ...
:::
::::
:::::
```

---

## Summary blocks

### `.summary-container` + `.block-azureblue`

Multi-block summary slide. Use at deck open or section recap. Each `.block-azureblue` is one sub-takeaway, with `.headline` for its label.

```
::::{.summary-container style="font-size:0.9em;"}
:::{.block-azureblue}
:::{.headline}
ラベル
:::
- 本文 bullet
- 本文 bullet
:::
... more blocks ...
::::
```

`.block-azureblue-with-bg` is the variant with a tinted background instead of a left bar — same internal API.

### `.main-message-block` / `.main-message-box`

Single-block "main message" callout, larger and louder than `.info-box`. Use when one sentence is the entire slide's payload.

---

## Cards

| Class | Render | Use for |
|---|---|---|
| `.component-card` | White card with shadow, hover lift | Generic content card. |
| `.component-card-for-analysis-summary` | Flat card, smaller font | Inside `.tools-grid` analysis-summary layouts. |
| `.component-card-index` | Bordered (#0a1e3d 2px), with `.title` slot | Index/agenda items. |

For `.component-card-index`:
```
:::{.component-card-index}
[1. セクション名]{.title}
- 内容...
:::
```

---

## Grids & layouts

| Class | Render | Use for |
|---|---|---|
| `.tools-grid` | 2-column CSS grid, gap 2em | Analysis-summary: 2×2 quadrants. |
| `.tools-column` | One column inside `.tools-grid` | Children for `.tools-grid`. |
| `.tools-column-after` | Variant with extra spacing | When the right column is action-items. |
| `.centered-column-wrapper` | Centers `.column` children | When `.columns` defaults look off-center. |

```
::::{.tools-grid}
::::: {.tools-column}
:::{.border-bottom-header}
左カラム見出し
:::
... cards ...
:::::
::::: {.tools-column}
:::{.border-bottom-header}
右カラム見出し
:::
... cards ...
:::::
::::
```

---

## List markers

Lists in Reveal default to disc bullets. The repo's CSS provides three styled variants — apply by wrapping the list in a div.

| Class | Marker | Use for |
|---|---|---|
| `.squaredmark` | Filled square in #0e3666 | Default for "structured/serious" lists. Used in pentagon/square boxes. |
| `.checkmark` | ✔ checkmark | "Done", "achieved", confirmable items. |
| `.checkmark_none` | Square (no checkmark) | When you want `.checkmark`'s spacing/typography but not the icon. |
| `.custom-list` | Custom bullet via `::before` | Edge cases; see CSS line 1511. |

Nested bullets automatically degrade to `disc` (one level) and the parent marker doesn't apply — this is intentional.

```
:::{.squaredmark style="font-size: 0.9em"}
- 親レベル（四角マーカー）
  - 子レベル（自動でdisc）
:::

:::{.checkmark}
- ✔ 完了したこと
- ✔ もう一つ完了したこと
:::
```

---

## Tables

| Class | Use for |
|---|---|
| `.custom-table` | The repo's standard styled table. |
| `.custom-table-no-header` | Same, when the first row isn't a header. |
| `.custom-table-for-analysis-summary` | Variant tuned for analysis-summary slides. |
| `.yaml2table` | Marker class — content rendered from YAML by `js/yaml2table.js`. |
| `.yaml2grouptable-custom-top` | Same, for grouped tables (`js/regmonkey_yaml2grouptable.js`). |

For YAML-driven tables, write YAML inside a fenced code block and the JS converts it at render time. See `posts/2025-10-17-index-slide/index.qmd` for a full example.

---

## Index slide

`.regmonkey-index-slide` and `.regmonkey-index-slide-no-title` are slide-level classes (apply to the H2). They convert the slide layout to the indexed-table-of-contents pattern with sidebar + numbered sections.

```
## Index {.regmonkey-index-slide}

::::: {.columns}
:::: {.column width="30%"}
:::: {.sidebar}
::: {.sidebar-title}
本研修の目的
:::
:::{.sidebar-text}
本文...
:::
::::
::::
::: {.column width="70%"}
::: {.regmonkey_index style="width:1100px"}
\`\`\`yaml
regmonkey_index:
  title_fontsize: 1.3em
  bullet_fontsize: 0.7em
  children:
    - title: 1. セクション名
      description:
        - 説明1
        - 説明2
      width: [28, 72]
\`\`\`
:::
:::
:::::
```

`.regmonkey_index` is processed by `js/regmonkey_index_summary.js` at render time. The YAML is the data; the visual is generated.

---

## Misc

| Class | Render | Use for |
|---|---|---|
| `.topleftbox` | Absolutely-positioned label at top-left of slide | Slide-type label like `[Goal Setting]{.topleftbox}` above an H2. |
| `.regmonkey-bold` | Color #206f83, bold ("McKinsey green") | Emphasis inline: `[強調]{.regmonkey-bold}`. |
| `.border-bottom` | Bottom border line | Section headers via inline span. |
| `.wrap-text` | Word-wrap rules | Force break long English/code in titles. |
