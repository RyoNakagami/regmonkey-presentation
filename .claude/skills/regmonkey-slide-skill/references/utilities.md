# Utilities & shortcodes reference

Fine-grained styling controls. These are utility classes (Tailwind-style: name encodes value) and Quarto shortcodes (function calls processed at render time). They compose with the components in `components.md`.

## Mental model

- **Class names encode values**: `.font-09` means `font-size: 0.9em`. `.padding-L-15` means `padding-left: 1.5em`. `.width-110` means `width: 110%`. The numeric suffix is the value, scaled. Once you know the convention you don't need to look up each one.
- **Shortcodes inject HTML at render time**: `{{< reveal_vspace 1em >}}` becomes a 1em-tall spacer div. They live in `_extensions/` and require the matching `filters:` entry in the YAML frontmatter.

## Font size

| Class | `font-size` |
|---|---|
| `.font-07` | 0.7em |
| `.font-07-half` | 0.75em |
| `.font-08` | 0.8em |
| `.font-08-half` | 0.85em |
| `.font-09` | 0.9em |
| `.font-10` | 1.0em |
| `.font-11` | 1.1em |
| `.font-12` | 1.2em |
| `.font-13` | 1.3em |
| `.font-14` | 1.4em |
| `.font-15` | 1.5em |
| `.font-20` | 2.0em |

Tip: in info-box bodies, `.font-10` is the comfortable default. For dense bullets that need to fit, drop to `.font-09`.

## Line height

Same numbering, applied to `line-height`:

| Class | `line-height` |
|---|---|
| `.lh-07` | 0.7em |
| `.lh-08` | 0.8em |
| `.lh-09` | 0.9em |
| `.lh-10` | 1.0em |
| `.lh-11` | 1.1em |
| `.lh-12` | 1.2em |
| `.lh-13` | 1.3em |
| `.lh-14` | 1.4em |
| `.lh-15` | 1.5em |
| `.lh-20` | 2.0em |

`.lh-12` is the everyday body line-height for Japanese text in this repo.

## Width / height

| Class | Value |
|---|---|
| `.width-80` | 80% |
| `.width-90` | 90% |
| `.width-105` | 105% |
| `.width-110` | 110% |
| `.width-115` | 115% |
| `.height-70` … `.height-110` | 70% … 110% |

When you make a block wider than 100%, pair with `.position-left-XX` to keep it visually centered.

## Position (left offset, in em)

| Class | `left` (relative position) |
|---|---|
| `.position-left-05` | -0.5em |
| `.position-left-10` | -1em |
| `.position-left-15` | -1.5em |
| `.position-left-20` | -2em |
| `.position-left-25` | -2.5em |
| `.position-left-30` | -3em |
| `.position-left-35` | -3.5em |
| `.position-left-40` | -4em |

Common pairing: `.width-110 .position-left-20` makes a content block visually fill more of the slide width while staying centered.

## Padding

Left-side padding (most common):

| Class | `padding-left` |
|---|---|
| `.padding-L-05` | 0.5em |
| `.padding-L-10` | 1em |
| `.padding-L-11` | 1.1em |
| `.padding-L-12` | 1.2em |
| `.padding-L-15` | 1.5em |
| `.padding-L-20` | 2em |

Top/bottom padding (symmetric):

| Class | `padding-top` & `-bottom` |
|---|---|
| `.padding-TB-none` | 0 |
| `.padding-TB-01` | 0.1em |
| `.padding-TB-02` | 0.2em |
| `.padding-TB-05` | 0.5em |

Margin: `.margin-B-00` zeros bottom margin (used to tighten lists). The repo doesn't have a full margin scale — for vertical breathing room, prefer the `reveal_vspace` shortcode.

## Tailwind-ish helpers

The repo also has tailwind-style classes available since `tailwindcss@2.2.19` is loaded via `_slide.yml` header-includes. Common ones used in templates:

- Flex: `.flex`, `.flex-1`, `.flex-wrap`, `.items-center`, `.items-container`, `.justify-center`, `.justify-end`, `.space-x-1`
- Margin: `.mr-2`, `.mr-3`, `.mb-4`, `.mt-0`
- Padding: `.pl-5`, `.pl-10`, `.pt-10`
- Text: `.text-center`, `.text-blue-500`, `.text-gray-500`, `.text-green-500`
- Sizing: `.w-full`, `.h-full`

Mix freely with the repo's own utilities. If a tailwind class doesn't render as expected, it may not be in the v2.2.19 base — fall back to the repo's own utility.

## Shortcodes

All require their filter in YAML frontmatter. Add filters that you actually use:

```yaml
filters:
  - reveal-auto-agenda          # Auto-generates agenda slides between sections
  - inject_anychart_js          # Injects AnyChart JS bundle (only if using AnyChart)
  - regmonkey_slide_editing     # Provides {{< fas >}} and section-header span flattening
```

`reveal_vspace` and `reveal_horizontal_line` register their CSS dependency automatically and don't need an explicit filter entry.

### Vertical / horizontal space

```
{{< reveal_vspace 0.5em >}}    {{< reveal_vspace 1em >}}    {{< reveal_vspace 15% >}}
{{< reveal_hspace 1em >}}
```

Default is 1em if the argument is omitted. Accepts any CSS length, including percentages (`%` is interpreted relative to the slide).

### Horizontal rule

```
{{< reveal_horizontal_line >}}                       <- 1px gray
{{< reveal_horizontal_line 2px #428CE6 >}}           <- 2px blue
{{< reveal_horizontal_line_with_tailwind "my-2 border-blue-500" >}}
```

### FontAwesome icon

```
{{< fas check-circle mr-2 text-green-500 >}}
{{< fas exclamation-triangle mr-2 text-blue-500 >}}
{{< fas star difficulty-star >}}
```

The first argument is the FontAwesome icon name (without `fa-` prefix). Subsequent arguments are extra CSS classes. Renders as `<i class="fas fa-check-circle mr-2 text-green-500"></i>`. Repository conventions:

| Use | Icon |
|---|---|
| Confirmed / can-do / モデル構築 | `check-circle` (text-green-500) |
| Requirement / 要件 | `clipboard-list` (text-blue-500) |
| Feasible / 実現可能 | `check-circle` (text-blue-500) |
| Caveat / 注意点 / 技術上の課題 | `exclamation-triangle` (text-blue-500) |
| User type | `user-check` |
| Difficulty rating | `star` |
| Tag/keyword | `tags` |
| Chart / data | `chart-line`, `bar-chart-fill` |

### Bootstrap icon

```
{{< bi exclamation-circle-fill size=1.6em color=#428CE6 >}}
{{< bi signpost-fill size=1.7em color=#428CE6 >}}
{{< bi funnel-fill size=1.7em color=#428CE6 >}}
{{< bi graph-up size=1.7em color=#428CE6 >}}
{{< bi bar-chart-fill size=1.7em color=#428CE6 >}}
```

Provided by the `shafayetShafee/bsicons` extension. Used heavily in keypoints headers — pick one that semantically labels the column. Standard sizes: 1.6em–1.7em. Standard color: `#428CE6` (the project blue).

## Inline span pattern

Pandoc lets you attach classes to inline spans with `[text]{.class}`. The repo uses this constantly:

| Pattern | Render |
|---|---|
| `[強調]{.regmonkey-bold}` | Bold + #206f83 (project green) |
| `[サブタイトル]{.h2-submessage}` | 1.3em bold + #0e3666 (project navy) |
| `[▶ 見出し]{.mini-section}` | Auto-prepends ▶, bold |
| `[Goal Setting]{.topleftbox}` | Absolutely positioned top-left of slide |
| `[ラベル]{.info-box-title}` | Bold dark, used inside `.info-box` |
| `[ラベル]{.def-title}` | Bold dark, used inside `.def-block` |

Combine with utilities: `[本文]{.regmonkey-bold .font-12}` is fine.

## When to use which spacing tool

| Situation | Use |
|---|---|
| Gap between two block-level components | `{{< reveal_vspace 0.5em >}}` (or `1em` for emphasis) |
| Tightening padding inside a single block | `.padding-TB-02` / `.padding-TB-05` |
| Indenting bullet body | `.padding-L-05` / `.padding-L-10` |
| Pulling a wide block back into visual center | `.width-110 .position-left-20` |
| Squeezing a list to fit more bullets | `.font-09 .lh-12` on the wrapper |
| Forcing line break inside title | `.wrap-text` on the H2 |
