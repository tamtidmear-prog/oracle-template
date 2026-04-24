#!/usr/bin/env bash
# pre-action.sh — Search past work before starting a new task
#
# Usage: bash tools/pre-action.sh "task description"

set -u
REPO="$(cd "$(dirname "$0")/.." && pwd)"
PSI="$(readlink -f "$REPO/ψ" 2>/dev/null || echo "$REPO/ψ")"
TASK="${1:?Usage: pre-action.sh \"task description\"}"

echo "═══ PRE-ACTION CHECK ═══"
echo "🎯 Task: $TASK"
echo ""

# Extract keywords (first 3 significant words)
KEYWORDS=$(echo "$TASK" | tr -cs '[:alnum:] ' ' ' | tr ' ' '\n' | awk 'length > 3' | head -5 | tr '\n' '|' | sed 's/|$//')

FOUND=0

# ── 1. Search retrospectives ──
RETRO_HITS=$(grep -ril "$KEYWORDS" "$PSI/memory/retrospectives/" 2>/dev/null | head -5)
if [ -n "$RETRO_HITS" ]; then
  echo "📝 Related retrospectives:"
  echo "$RETRO_HITS" | while read f; do
    echo "  → $(basename "$f"): $(head -1 "$f" | sed 's/^#* *//')"
  done
  FOUND=$((FOUND + 1))
  echo ""
fi

# ── 2. Search learnings ──
LEARNING_HITS=$(grep -ril "$KEYWORDS" "$PSI/memory/learnings/" 2>/dev/null | head -5)
if [ -n "$LEARNING_HITS" ]; then
  echo "💡 Related learnings:"
  echo "$LEARNING_HITS" | while read f; do
    echo "  → $(basename "$f"): $(head -1 "$f" | sed 's/^#* *//')"
  done
  FOUND=$((FOUND + 1))
  echo ""
fi

# ── 3. Search handoffs ──
HANDOFF_HITS=$(grep -ril "$KEYWORDS" "$PSI/inbox/handoff/" 2>/dev/null | head -3)
if [ -n "$HANDOFF_HITS" ]; then
  echo "📋 Related handoffs:"
  echo "$HANDOFF_HITS" | while read f; do
    echo "  → $(basename "$f"): $(head -1 "$f" | sed 's/^#* *//')"
  done
  FOUND=$((FOUND + 1))
  echo ""
fi

# ── 4. Search active work ──
ACTIVE_HITS=$(grep -ril "$KEYWORDS" "$PSI/active/" 2>/dev/null | head -3)
if [ -n "$ACTIVE_HITS" ]; then
  echo "🔬 Active research:"
  echo "$ACTIVE_HITS" | while read f; do
    echo "  → $(basename "$f"): $(head -1 "$f" | sed 's/^#* *//')"
  done
  FOUND=$((FOUND + 1))
  echo ""
fi

# ── Summary ──
if [ "$FOUND" -eq 0 ]; then
  echo "✅ No related past work found — safe to start fresh"
else
  echo "⚠️  Found related past work — review before starting"
  echo "   Build on what exists rather than starting from scratch"
fi
echo ""
echo "═══ CHECK COMPLETE ═══"
