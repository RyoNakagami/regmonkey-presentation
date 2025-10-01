# README

## Decktape: Reveal.jsのプレゼンテーションをPDFに変換するスクリプト

- 使用方法: ポート4201でローカルサーバーが実行中で、Chromeがインストールされていることを確認

**&#9654;&nbsp; ワンライナー**

```bash
decktape reveal http://localhost:4201/posts/2025-05-07-how-to-write-slide/index.html test.pdf --chrome-path /usr/bin/google-chrome
```

**&#9654;&nbsp; スクリプト**

```bash
# Default configuration / デフォルト設定
PORT="${PORT:-4201}"
SLIDES="${SLIDES:-1-100}"
LOAD_PAUSE="${LOAD_PAUSE:-2000}"
OUTPUT_FILE="${OUTPUT_FILE:-output.pdf}"
CHROME_PATH="${CHROME_PATH:-/usr/bin/google-chrome}"

# Validate port is available / ポートが利用可能か確認
if ! nc -z localhost "$PORT"; then
  echo "Error: Server not running on port $PORT"
  echo "エラー: ポート$PORTでサーバーが実行されていません"
  exit 1
fi

# Convert presentation to PDF / プレゼンテーションをPDFに変換
decktape reveal \
  --load-pause "$LOAD_PAUSE" \
  --slides "$SLIDES" \
  --chrome-arg="--no-sandbox" \
  --chrome-arg="--disable-dev-shm-usage" \
  --chrome-path "$CHROME_PATH" \
  http://localhost:${PORT}/posts/2025-05-07-how-to-write-slide/index.html \
  "$OUTPUT_FILE" \
  || { echo "Error: PDF conversion failed"; exit 1; }

# Verify PDF was created successfully / PDFが正常に生成されたか確認
if [ -f "$OUTPUT_FILE" ]; then
  echo "✓ PDF generated successfully"
  echo "Output / 出力先: $(pwd)/${OUTPUT_FILE}"
else
  echo "✗ PDF generation failed"
  exit 1
fi
```

## Icons

| 項目      | command | 利用場面例 |
|-----------|--------|-----------|
| モデル構築 | `{{< fas fa-check-circle mr-2 text-green-500 >}}` ||
| 要件      | `{{< fas fa-clipboard-list mr-2 text-blue-500 >}`||
| チェックマーク | `{{< fas fa-check-circle mr-2 text-blue-500 >}}`|実現可能なこと|
| 注意      | `{{< fas fa-exclamation-triangle mr-2 text-blue-500 >}}`| 技術上の課題 |
