---
name: "regmonkey-slide-skill"
description: "Author Quarto Reveal.js slide decks for the regmonkey-presentation site (style/revealjs.css). Use whenever the user wants to create, edit, or extend a slide in this repo — especially when they say 'スライド', 'qmd', 'deck', 'プレゼン', 'セクションを足して', '対比で見せて', 'AS-IS / TO-BE', or reference any house pattern (pentagon-box, square-box, hop-step-jump, info-box, summary, Index, Abstract)."
---


# regmonkey-slide-skill

このリポジトリのスライドは Quarto の `.qmd` ファイルとして書かれ，Reveal.js にコンパイルされる．デザインの本体は `style/revealjs.css`（名前付きコンポーネントが3000行以上）と `_extensions/`（カスタムショートコード）に存在する．生 HTML を書いたり新しいクラス名を発明したりすると，このシステムは機能しない．この Skill は規約を体系化し，新しいスライドが既存の 24本以上の deck と同じ見た目になるよう保証する．

Skill の仕事は，スライドを書くときに以下を守らせることである：

1. 正しいパターンから始める（即興のマークアップではなく既知のコンポーネントを使う）
2. 正しい Quarto フェンス div 構文を使う（厳密で壊しやすい）
3. ハウスライティングルールに従う（1スライド1メッセージ，MMUF，区切り記号 `/` を使わない）

## どのファイルをいつ読むか

この SKILL.md にはワークフローと最頻出パターンが埋め込まれている．以下は必要なときだけ読む：

- **`references/components.md`** — 名前付きコンポーネントの完全カタログ（pentagon/square ボックス全サイズ，def-block，info/success/warning/caution/danger ボックス，hop-step-jump，horizontal-keypoints，summary ブロック，component-cards，tools-grid，mini-section，h2-submessage，border-bottom-headers）．インラインに載っていない4つ以外のコンポーネントを使うとき，または正確なサイズバリアントが必要なときに開く．
- **`references/utilities.md`** — ユーティリティクラス（`.font-07`〜`.font-20`，`.lh-07`〜`.lh-20`，`.padding-L-05`〜`.padding-L-20`，`.width-90`〜`.width-110`，`.position-left-XX`，`.checkmark`，`.squaredmark`）とショートコード（`{{< reveal_vspace >}}`，`{{< reveal_hspace >}}`，`{{< fas >}}`，`{{< bi >}}`）．スペーシング・フォントサイズの微調整やアイコン追加が必要なときに開く．
- **`references/patterns.md`** — スライドレベルのパターン（Index slide，Abstract slide，Summary slide，AS-IS/TO-BE のゴール設定スライド，Research-proposal，書籍紹介，meta-data セクション扉）．コンポーネント単位ではなく*スライド種別*での要望が来たときに開く．
- **`templates/*.qmd`** — 即コピペ可能なテンプレート9点．コピーして編集すること．書き直さない．

迷ったらまず `references/components.md` を見る．間違ったクラス名を選ぶのが最も多い失敗モードである．

## 執筆ワークフロー

1. **そのスライドの役割を特定する．** ワンメッセージのテイクアウェイか，比較か，プロセスか，定義か，セクション扉か，サマリーか？役割がパターンを決める．
2. **パターンを選ぶ．発明しない．** 下のインラインチートシートと照合し，該当なしなら `references/patterns.md` と `references/components.md` をスキャンする．
3. **テンプレートが当てはまるならそこから始める．** `templates/` にコンポーネント名で命名された 9つの `.qmd` ファイルがある．新しい post ディレクトリに該当ファイルをコピーし，中身を上書きする — 構造をゼロから書き直さない．
4. **MMUF ルール（Main Message Up Front）に従って中身を埋める．** H2 タイトルは結論を1文で言い切る．箇条書きはそれを支える．1スライド1メッセージ．2つのことを言いたいなら分割する．
5. **完了宣言の前に，次節の writing rule をすべて適用する．**

## ハウスライティングルール（絶対遵守）

- **1スライド1メッセージ．** H2（`##`）はそのスライドのテイクアウェイ文であって，トピックラベルではない．「モデル管理の自動化を MLflow 導入により実現」 — yes．「MLflow について」 — no．
- **MMUF．** 結論先出し，根拠は後．箇条書きは「なぜ H2 が真なのか」を説明するもの．
- **`/` をリスト区切りに使わない**（日本語の散文の中で）．インラインで並列項目には `・` を，文として読ませるときは `、` に置き換える．`Python・SQL・R` または `Python、SQL、R` — yes．`Python / SQL / R` — no．（例外：コード・パス・URL の中はそのまま `/` でよい）
- **`—`（em dash）より `：` を優先する．** 日本語スライド本文で説明・補足・列挙を導く区切り記号は `：` の方が自然．`—` は英文のリズムに合わせた記号で和文では浮く．`評価の3観点：速度・精度・コスト` と書く．`評価の3観点 — 速度・精度・コスト` は不可．（例外：英文 prose や見出しの subtitle，このルール文書のように `yes — no` の対比を示す場面ではそのまま `—` を使ってよい）
- **誇張・煽り表現を使わない．「驚くほど」「劇的に」「圧倒的に」「魔法のように」「革命的」「完璧」「究極」「秒で」「あっという間に」「楽々」のような不自然な日本語は，技術スライドの信頼性を下げる．** 代わりに具体的な数字・事実・構造で語る．`驚くほど単純` → `3ステップで済む`．`劇的に高速化` → `処理時間が80%減`．`魔法のように動く` → `自動でロードされる`．断定できないなら断定しない．「シンプル」「明快」「自動」のような中立語は OK．迷ったら「この語を抜いても意味が変わらないか」を自問し，変わらないなら抜く．
- **Quarto フェンス div はリテラルに書く．** リポジトリの CSS は特定のクラス名をターゲットにしている．`:::{.pentagon-box-500}` は機能する；`<div class="pentagon-box-500">` は Quarto の処理を無効化する．構文の注意点は次節を参照．
- **コードのフォントは `monospace`（プロジェクトのデフォルト）．** コードブロックやインラインコードに `font-family` を設定しない．`_quarto.yml` で `monofont: monospace` が既に指定済みで，これを上書きするとサイト全体の見た目の一貫性が崩れる．

## 推奨ルール（better practice）

絶対遵守ではないが，守ると読みやすくなる指針．逸脱するなら理由を持つこと．

- **H2 タイトルは35文字以内が望ましい．** H2（`##`）はテイクアウェイ文だが，長すぎるとスライド最上部で折り返し，視認性が落ちる．35字を超えそうなら本体を短くまとめ，補足は直下の `[...]{.h2-submessage}` に逃がす．例：「MLflow を導入してモデル管理・実験ログ・成果物アーカイブを統合的に自動化する」（39字）→ H2 に「MLflow でモデル管理を自動化」（13字），h2-submessage に「実験ログ・成果物アーカイブも統合的に取り込む」．
- **対比は pentagon（左）× square（右）でペアにする．** Pentagon の右向き矢印は，問題/課題/AS-IS を square 側の解決/対応/TO-BE へ視覚的に運ぶ．左右を逆にしない．Square 2つで対比させない．


## Quarto フェンス div 構文 — 一度だけ読む

colon の数が重要．外側のラッパーは内側より*多く*の colon を必要とする．2カラムレイアウトの中に2つのボックス，さらにその中にヘッダー div を入れた場合の構造は以下：

```
:::::: {.columns}                  <- 6 colons, outermost
::::: {.column width="50%"}        <- 5 colons
::::{.pentagon-box-500}            <- 4 colons
:::{.border-bottom-header-left}    <- 3 colons (innermost)
左カラムのヘッダー
:::
:::{.squaredmark}
- 箇条書き本体
:::
::::
:::::
::::: {.column width="50%"}
::::{.square-box-500}
... right column ...
::::
:::::
::::::
```

よくあるミス：閉じフェンスの欠落，ネストレベル間で同じ colon 数を使う（Pandoc がどれを閉じるべきか混乱する），属性を間違った colon の後に置く．迷ったらテンプレートをコピーして中身を編集すること．

## YAML frontmatter — コピペして編集

このリポジトリのすべての post はこのブロックで始まる．`filters` は必須．省略するとショートコード（`reveal_vspace`，`fas`，`bi`）が生のテキストとして表示されるだけになる．

```yaml
---
title: "<スライドの結論を1文で>"
subtitle: "<シリーズ名・サブタイトル>"
author: "Ryo Nakagami"
date: "YYYY-MM-DD"
categories: [<tag1>, <tag2>]
slide-number: true
filters:
  - reveal-auto-agenda
  - inject_anychart_js     # AnyChartを使わないなら省略可
  - regmonkey_slide_editing
auto-agenda:
  bullets: bullets
---
```

注意：post ディレクトリは `posts/YYYY-MM-DD-<slug>/index.qmd` に置く．`posts/_metadata.yml` とリポジトリ直下の `_slide.yml` が format 設定の残り（revealjs，1600×900，Meiryo，MathJax 3 等）を供給する — post 内で重複指定しない．

## インラインパターンチートシート

大半のスライドは4つのパターンでカバーできる．記憶から使うこと．どれにも当てはまらない時のみ `references/components.md` に手を伸ばす．

### パターン1 — Pentagon × Square（対比）

**問題と，それに対する応答**，AS-IS と TO-BE，現状と目標，gap と bridge，のような関係があるときに使う．左に pentagon（矢印が右に向き答えを指す），右に square（答えがそこに置かれる）．

```
:::::: {.columns}
::::: {.column width="50%"}
::::{.pentagon-box-500}
:::{.border-bottom-header-left}
データ分析プロジェクトにおける課題
:::
:::{.squaredmark style="font-size: 0.9em"}
- 方針・手法・解釈が分析担当者個人に依存
  - 再現性・継続性が低下
- 分析プロセスが終わった段階で共有されがち
  - チーム全体の知見を方針策定に結び付けられない
:::
::::
:::::
::::: {.column width="50%"}
::::{.square-box-500}
:::{.border-bottom-header-left}
会話型データ分析の実現ステップ
:::
:::{.squaredmark style="font-size: 0.9em"}
- Step 1: RAP の観点で現状の知見を整理
- Step 2: 現状課題の洗い出し・言語化
- Step 3: 仮説や分析アプローチをワークショップで議論
:::
::::
:::::
::::::
```

サイズバリアントあり：`pentagon-box-400` / `-500` / `-550` / `-600` / `-700` を，同じ番号の `square-box-` とペアで使う．数字はボックスの高さ（px）．コンテンツの密度で選ぶ．`-500` がデフォルト．

### パターン2 — Hop-Step-Jump（3段階の進展）

**3つの段階・レベル・フェーズが昇順に左から右へ読める**ときに使う．Junior → Mid → Senior．Phase 1 → 2 → 3．順序のない比較には使わない．

```
:::::{.hop-step-jump-container}
::::{.step .step-1}
:::{.step-number}
ジュニアDS
:::
:::{.step-title}
分析ができる
:::
:::{.info-content}
- 実装スキル（Python・SQL・R など）
- 可視化・要約・特徴量エンジニアリングの基本技術
:::
::::
::::{.step .step-2}
:::{.step-number}
ミドルDS
:::
:::{.step-title}
分析を構想できる
:::
:::{.info-content}
- 問いの構造化・仮説立案・手法選定
- 分析計画とタスクの分解・優先順位づけ
:::
::::
::::{.step .step-3}
:::{.step-number}
シニアDS
:::
:::{.step-title}
プロジェクトを組織で推進できる
:::
:::{.info-content}
- PJマネジメント
- 顧客・社内ステークホルダーとの合意形成
:::
::::
:::::
```

### パターン3 — Info-box + 箇条書き（最頻出）

スライドが**フレームに囲まれた概念と支持箇条書き**だけで済むときに使う．このリポジトリで最も多いパターン．左の青いバーが「定義/テイクアウェイ」を意味する．

```
{{< reveal_vspace 0.5em >}}

:::{.info-box}

:::{.info-contents .font-10 .padding-L-05 .lh-12}

{{< reveal_vspace 0.25em >}}

- コーディングエージェントとは [LLMが自律的にコードを書き・実行・検証するAIエージェント]{.regmonkey-bold} のこと
- 「[計画 → 実行 → 検証 → 修正]{.regmonkey-bold}」のループを自走しタスク完了まで反復する
:::

:::

{{< reveal_vspace 0.3em >}}

[補足セクション見出し]{.mini-section}
```

ステータスバリアント：`.success-box`（緑），`.warning-box`（黄），`.caution-box`（オレンジ），`.danger-box`（赤）．内部構造は同じ．

**ルール:** `:::{.info-contents ...}` の直後が箇条書き（`-` 始まり）になるときは，最初のリスト項目の上に `{{< reveal_vspace 0.25em >}}` を 1 行入れて上端の余白を確保する．`.info-box` 系（`success-box` / `warning-box` / `caution-box` / `danger-box`）すべてに共通．

### パターン4 — Azure-blue Summary（複数ブロックの要約スライド）

**deck の冒頭サマリーまたはセクションのまとめ**に使う．各ブロックは1つのサブテイクアウェイと支持箇条書きで構成．

```
## Summary

{{< reveal_vspace 1em >}}

::::{.summary-container style="font-size:0.9em;"}

:::{.block-azureblue}
:::{.headline}
スライド作成の基本
:::
- プロセス: 「メッセージ設計」→「構成検討」→「スライド作成」の順で進める
:::

:::{.block-azureblue}
:::{.headline}
メッセージ設計
:::
- 3W: 誰に・何を・なぜ伝えるのかを明確化する
- RAPフレームワーク: Research Question・Answer・Positioning Statement
:::

::::
```

**Summary バリアント — yaml2table 3 列（category × rule × actions）:** 各セクションが「**原則 + 具体アクション**」のセットで束ねられるとき，`.block-azureblue` の代わりに `templates/summary-yaml2table.qmd` を使う．category（短いラベル）/ rule（1 文の主原則）/ actions（プロセスとして読める動詞句のリスト）の 3 列構造．推奨ルールと完全な解説は `references/patterns.md` の §3 を参照．

## スペーシング・サイズ・アイコン — クイックリファレンス

- ブロック間の縦の余白：`{{< reveal_vspace 0.5em >}}`（`1em`，`2em`，`15%` 等も指定可）．
- ブロックのフォントサイズ：`.font-09`（= 0.9em），`.font-10`（= 1.0em），`.font-20` まで．行送りも同様に `.lh-12`（= 1.2em）．
- 左パディング：`.padding-L-05` 〜 `.padding-L-20`．
- 幅・位置ヘルパー：`.width-110` でブロック幅を 110% に．`.position-left-20` と組み合わせて中央揃えを保つ．
- FontAwesome アイコン：`{{< fas check-circle mr-2 text-blue-500 >}}`．Bootstrap アイコン：`{{< bi signpost-fill size=1.7em color=#428CE6 >}}`．
- インラインのハイライト：`[強調したい語]{.regmonkey-bold}`（#206f83 の太字になる）．小見出し：`[見出し]{.mini-section}`（▶ 付きでレンダリングされる）．

ユーティリティ値の全リストは `references/utilities.md`．

## テンプレートを起点にする

`templates/` はリポジトリ直下の `template/` ディレクトリのミラーになっている．以下のような依頼が来たとき，スクラッチで書く前に対応する `.qmd` をコピーする：

| ユーザーの依頼 | コピー元（`templates/`） |
|---|---|
| 対比 / 課題と対応 | `pentagon-squared-box.qmd` |
| 三段階の成長 / フェーズ展開 | `hop-step-jump.qmd` |
| 三つの観点を横並び | `three-horizontal-points.qmd` |
| 概念の定義スライド | `concept-explanation.qmd` |
| 分析サマリースライド (4要素) | `analysis-summary.qmd` |
| Azure blue サマリー | `azureblue-summary.qmd` |
| Summary（category × rule × actions の 3 列） | `summary-yaml2table.qmd` |
| 番号付きタイトル付き info-box（2 列 × 3 行のグリッド） | `info-box-titled.qmd` |
| 章扉・セクション開始 | `meta-data-slide.qmd` |
| 書籍紹介 | `book-template.qmd` |
| 同じ枠の左右対比（情報密度高め） | `info-box-with-two-cols.qmd` |
| Lecture系スライドのトップページ（対象レベル・前提知識・必要環境＋目次） | `lecture-index-slide.qmd` |

**`lecture-index-slide.qmd` のサイドバーについて:** 3 枚の `.component-card-index` のタイトル（テンプレートでは `対象レベル` / `前提知識` / `必要環境`）は固定ではない．deck の趣旨に合わせて `学習目標` / `対象レベル` / `前提知識 & 必要環境` のように自由に差し替えてよい．`{{< bi ... >}}` のアイコン（`bullseye` / `person` / `book` / `terminal` 等）も内容に合わせて選び直す．カードの数（2〜3 枚）も deck に合わせて調整可．

## よくある失敗モード（避けるべき）

- **CSS に存在しないクラス名を発明する．** `pentagon-box-450` がなければ `-400` か `-500` を使う．存在しないクラスは無音でスタイル無しでレンダリングされる．
- **対比に square を2つ使う．** Pentagon × square の視覚的な非対称性*そのものが*意味になる．Square 2つだと並列に読めて，問題→答えに見えない．
- **YAML の filter を忘れる．** `regmonkey_slide_editing` と `inject_anychart_js` がないと，`{{< fas >}}` のショートコードや AnyChart の可視化がリテラルテキストのまま表示される．
- **コードに `font-family` を設定する．** プロジェクトは敢えて汎用 `monospace` を使い，ブラウザのデフォルト等幅フォントを統一的に表示させている．カスタム CSS やインラインスタイルでこれを上書きしない．
- **散文の中で `/` を区切りに使う．** `Python / SQL / R` は誤．`Python・SQL・R` と書く．コード/パスの中はそのまま OK．
- **フェンス colon 数の不整合．** ネストが壊れたらパッチではなくテンプレートをコピーする．

## 新規パターンが必要なとき

依頼が `references/components.md` や `references/patterns.md` のどのパターンにも当てはまらない場合：

1. それを明示的に伝える．既存コンポーネントで偽装しない．
2. 一番近い既存パターンを提案し，それを変形するか CSS を拡張するか確認する．
3. CSS 拡張は `style/revealjs.css` を直接編集する．関連クラスの近く（`/* keypoints-block */` 等のセクションコメントを検索）に新クラスを追加し，既存命名規則に従い（`-400`/`-500` のサイズサフィックス，`-left` の位置サフィックス），対応するフェンス div を `template/` 配下の新ファイルに定義して再利用可能にする．
