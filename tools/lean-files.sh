#!/usr/bin/env bash
# lean-files.sh — Summarize multiple files in 2 lines each
#
# Usage: bash tools/lean-files.sh <directory>
#        bash tools/lean-files.sh <file1> <file2> ...

set -u
MAX_PREVIEW="${2:-2}"

if [ -d "${1:-}" ]; then
  FILES=$(find "$1" -name '*.md' -not -path '*/.git/*' -not -name '.gitkeep' | sort)
elif [ $# -gt 0 ]; then
  FILES="$@"
else
  echo "Usage: lean-files.sh <dir|files...>"
  exit 1
fi

COUNT=0
TOTAL_LINES=0

for f in $FILES; do
  [ -f "$f" ] || continue
  COUNT=$((COUNT + 1))
  LINES=$(wc -l < "$f")
  TOTAL_LINES=$((TOTAL_LINES + LINES))
  TITLE=$(head -1 "$f" | sed 's/^#* *//')
  PREVIEW=$(grep -v '^#\|^$\|^---\|^>\|^<!--' "$f" | head -"$MAX_PREVIEW" | tr '\n' ' ' | head -c 120)
  echo "[$COUNT] $f ($LINES lines)"
  echo "    $TITLE — ${PREVIEW:-[empty]}"
done

echo ""
echo "Total: $COUNT files, $TOTAL_LINES lines"
echo "Saved ~$((TOTAL_LINES - COUNT * 3)) lines of context vs reading raw"
