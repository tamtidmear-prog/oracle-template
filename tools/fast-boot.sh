#!/usr/bin/env bash
# fast-boot.sh — Single-call session boot: handoff + git + inbox
#
# Usage: bash tools/fast-boot.sh

set -u
REPO="$(cd "$(dirname "$0")/.." && pwd)"
PSI="$(readlink -f "$REPO/ψ" 2>/dev/null || echo "$REPO/ψ")"

echo "═══ ORACLE BOOT ═══"
echo ""

# ── 1. Latest handoff ──
HANDOFF=$(ls -t "$PSI/inbox/handoff/"*.md 2>/dev/null | head -1)
if [ -n "$HANDOFF" ]; then
  echo "📋 Handoff: $(basename "$HANDOFF")"
  echo "---"
  head -40 "$HANDOFF"
  echo "---"
else
  echo "📋 No handoff found (first session?)"
fi
echo ""

# ── 2. Git status ──
echo "🔀 Git:"
cd "$REPO"
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
LAST_COMMIT=$(git log --oneline -1 2>/dev/null || echo "no commits")
DIRTY=$(git status --short 2>/dev/null | wc -l)
echo "  Branch: $BRANCH"
echo "  Last commit: $LAST_COMMIT"
if [ "$DIRTY" -gt 0 ]; then
  echo "  ⚠️  Uncommitted changes: $DIRTY files"
  git status --short 2>/dev/null | head -10 | sed 's/^/  /'
else
  echo "  Clean ✓"
fi

AHEAD=$(git rev-list --count @{u}..HEAD 2>/dev/null || echo "?")
if [ "$AHEAD" != "?" ] && [ "$AHEAD" -gt 0 ]; then
  echo "  ↑ $AHEAD commits ahead of remote"
fi
echo ""

# ── 3. Inbox ──
INBOX_COUNT=$(find "$PSI/inbox/" -name '*.md' -not -name '.gitkeep' 2>/dev/null | wc -l)
HANDOFF_COUNT=$(find "$PSI/inbox/handoff/" -name '*.md' -not -name '.gitkeep' 2>/dev/null | wc -l)
INBOX_NEW=$((INBOX_COUNT - HANDOFF_COUNT))
echo "📨 Inbox: $INBOX_NEW messages, $HANDOFF_COUNT handoffs"
if [ "$INBOX_NEW" -gt 0 ]; then
  find "$PSI/inbox/" -maxdepth 1 -name '*.md' -not -name '.gitkeep' 2>/dev/null | sort -r | head -5 | while read f; do
    echo "  → $(basename "$f")"
  done
fi
echo ""

# ── 4. Vault stats ──
RETROS=$(find "$PSI/memory/retrospectives/" -name '*.md' -not -name '.gitkeep' 2>/dev/null | wc -l)
LEARNINGS=$(find "$PSI/memory/learnings/" -name '*.md' -not -name '.gitkeep' 2>/dev/null | wc -l)
RESONANCE=$(find "$PSI/memory/resonance/" -name '*.md' -not -name '.gitkeep' 2>/dev/null | wc -l)
echo "🧠 Vault: $RETROS retros, $LEARNINGS learnings, $RESONANCE resonance"

# ── 5. Today's work ──
TODAY=$(date +%Y-%m-%d)
TODAY_RETROS=$(find "$PSI/memory/retrospectives/" -name "${TODAY}*" 2>/dev/null | wc -l)
TODAY_LEARNINGS=$(find "$PSI/memory/learnings/" -name "${TODAY}*" 2>/dev/null | wc -l)
if [ "$TODAY_RETROS" -gt 0 ] || [ "$TODAY_LEARNINGS" -gt 0 ]; then
  echo "📅 Today: $TODAY_RETROS retros, $TODAY_LEARNINGS learnings"
fi

echo ""
echo "═══ BOOT COMPLETE ═══"
