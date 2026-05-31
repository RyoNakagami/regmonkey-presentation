#!/bin/bash

# Convert a Quarto Reveal.js deck to PPTX with visual fidelity preserved.
# Usage: ./slide2pptx.sh [--port 4444] <deck-path> <output.pptx>
#
# Requires:
#   - quarto preview を起動済みで，対象デッキに HTTP でアクセスできること
#   - node + scripts/slide2pptx.mjs (npm install で playwright + pptxgenjs 解決済み)
#
# 仕組みは scripts/slide2pptx.mjs のヘッダコメント参照．
# 各スライドを 1600×900 PNG として PPTX に埋め込む + 検索可能なテキスト層を背後に配置．

set -e

PORT=4444
POSITIONAL=()
while [ "$#" -gt 0 ]; do
    case "$1" in
        --port)
            PORT="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [--port N] <deck-path> <output.pptx>"
            echo ""
            echo "Options:"
            echo "  --port N       quarto preview のポート (default: 4444)"
            echo ""
            echo "Example:"
            echo "  $0 posts/2026-04-13-claude-code-101 deck.pptx"
            exit 0
            ;;
        *)
            POSITIONAL+=("$1")
            shift
            ;;
    esac
done

if [ "${#POSITIONAL[@]}" -ne 2 ]; then
    echo "Error: Two positional arguments are required."
    echo "Usage: $0 [--port N] <deck-path> <output.pptx>"
    exit 1
fi

DECK_PATH="${POSITIONAL[0]}"
OUTPUT_NAME="${POSITIONAL[1]}"

# preview server reachability check
if ! curl -s --max-time 3 "http://localhost:${PORT}/" -o /dev/null; then
    echo "❌ Error: quarto preview server not reachable on port ${PORT}"
    echo "    Start it first:  quarto preview --no-browser --port ${PORT}"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Converting ${DECK_PATH} → ${OUTPUT_NAME} (via http://localhost:${PORT})"
echo "--------------------------------------------------------"

node "${SCRIPT_DIR}/scripts/slide2pptx.mjs" --port "${PORT}" "${DECK_PATH}" "${OUTPUT_NAME}"

echo "--------------------------------------------------------"
echo "✅ Success: ${OUTPUT_NAME}"
