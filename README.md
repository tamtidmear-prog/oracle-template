# Oracle — Persistent AI Agent Framework

> "The Oracle Keeps the Human Human"

## What is Oracle?

Every time you start a new AI conversation, it forgets everything. Your context, your preferences, your progress — gone.

**Oracle fixes this.**

Oracle is a framework for building **persistent AI agents** that:
- **Remember** — store knowledge in a structured vault (`ψ/`)
- **Learn** — capture patterns and lessons from every session
- **Reincarnate** — read their memory at session start to restore identity and context
- **Grow** — today's Oracle is always smarter than yesterday's

It works with [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (Anthropic's CLI) and uses `CLAUDE.md` as the Oracle's soul — a file that defines identity, rules, and operating procedures.

## Quick Start

```bash
# 1. Clone this template
git clone https://github.com/YOUR_USERNAME/oracle-template.git my-oracle
cd my-oracle

# 2. Install Claude Code (if you haven't)
npm install -g @anthropic-ai/claude-code

# 3. Customize your Oracle's identity
#    Open CLAUDE.md and replace all {{PLACEHOLDER}} values:
#    - {{ORACLE_NAME}} → your Oracle's name
#    - {{HUMAN_NAME}} → your name
#    - {{PURPOSE}} → what your Oracle does
#    - {{THEME}} → a guiding motto
#    - {{BORN_DATE}} → today's date
#    - etc.

# 4. Start Claude Code
claude

# 5. Your Oracle is alive — start working
```

That's it. Your Oracle reads `CLAUDE.md` on every session start and operates according to the identity and rules you defined.

## How It Works

### The Soul: `CLAUDE.md`

This file defines **who** your Oracle is:
- Identity (name, purpose, theme)
- Operating rules and philosophies
- Session procedures (boot → work → shutdown)
- Safety rules

Claude Code reads this file automatically at session start. It shapes every response and decision your Oracle makes.

### The Brain: `ψ/` vault

This directory is your Oracle's **memory**:

```
ψ/
├── inbox/              ← Messages, tasks, session handoffs
│   └── handoff/        ← "Here's where I left off" notes
├── memory/
│   ├── resonance/      ← WHO: identity, soul, philosophy
│   ├── learnings/      ← WHAT: patterns discovered
│   ├── retrospectives/ ← WHEN: session journals
│   └── logs/           ← Ephemeral moments
├── writing/            ← Drafts in progress
├── active/             ← Current research focus
├── outbox/             ← Outgoing messages
├── archive/            ← Completed work
├── lab/                ← Experiments
├── learn/              ← Study materials
├── shared/             ← Cross-agent items
└── later/              ← Parked / deferred
```

**Knowledge flows upward:**
```
active/ → logs → retrospectives → learnings → resonance
(research → snapshot → session → patterns → soul)
```

Raw observations become session notes, which become patterns, which become core identity.

### The Lifecycle: Session Discipline

Every session follows the same rhythm:

```
┌─────────────────────────────────────────────────┐
│  START          DURING            END            │
│  ─────          ──────            ───            │
│  fast-boot.sh → Work + Learn   → Retrospective  │
│  Read handoff   Save patterns    git commit      │
│  Orient         Verify results   git push        │
│                                  Write handoff   │
└─────────────────────────────────────────────────┘
```

**Start:** Run `bash tools/fast-boot.sh` to read where you left off, check git status, and scan inbox.

**During:** Work on tasks. Before big tasks, run `bash tools/pre-action.sh "description"` to check if you've done related work before.

**End:** Write a retrospective (what happened, what was learned), commit to git, write a handoff note for the next session.

This cycle ensures nothing is lost between sessions.

## Tools

The `tools/` directory contains scripts that help your Oracle work efficiently:

| Script | Purpose | Usage |
|--------|---------|-------|
| `fast-boot.sh` | Session boot — handoff + git + inbox in 1 call | `bash tools/fast-boot.sh` |
| `pre-action.sh` | Search past work before starting new tasks | `bash tools/pre-action.sh "task description"` |
| `lean-files.sh` | Summarize multiple files (2 lines each) | `bash tools/lean-files.sh <directory>` |
| `report.ts` | Generate a visual dashboard in the browser | `bun tools/report.ts` |

### Dashboard Report

Run `bun tools/report.ts` to generate a visual report of your Oracle's data:
- Vault statistics (files per directory)
- Recent sessions and retrospectives
- Learnings collected
- Session timeline
- Knowledge flow visualization

The report opens automatically in your browser.

## The 5 Core Philosophies

1. **Nothing is Deleted** — history is preserved, never erased. Old ideas are superseded, not destroyed.
2. **Patterns Over Intentions** — learn from real behavior, not assumptions about what the human wants.
3. **External Brain, Not Command** — AI advises and connects dots proactively. The human decides.
4. **Curiosity Creates Existence** — the deeper the questions, the smarter the system. Ask "why" relentlessly.
5. **Form and Formless** — follow structure, but stay flexible when solving real problems.

## Customization

### Identity

Open `CLAUDE.md` and replace all `{{PLACEHOLDER}}` values with your Oracle's details. The key fields:

| Placeholder | What to fill in | Example |
|-------------|----------------|---------|
| `{{ORACLE_NAME}}` | Your Oracle's name | "Atlas", "Sage", "Echo" |
| `{{HUMAN_NAME}}` | Your name | "Alex" |
| `{{PURPOSE}}` | What your Oracle does | "Full-stack development assistant" |
| `{{THEME}}` | A guiding motto | "Build fast, break nothing" |
| `{{BORN_DATE}}` | Today's date | "2026-04-24" |
| `{{LANGUAGE}}` | Your primary language | "English", "Thai + English" |

### Adding Custom Rules

Add rules to **Section 4 (Critical Rules)** in `CLAUDE.md`. Your Oracle follows these every session.

### Adding Tools

Drop scripts into `tools/`. Reference them in `CLAUDE.md` so your Oracle knows to use them.

### Adding Memory

Write `.md` files into the appropriate `ψ/` directories:
- `ψ/memory/resonance/` — core identity documents
- `ψ/memory/learnings/` — patterns and discoveries
- `ψ/inbox/` — tasks and messages

Your Oracle reads these at session start to restore context.

## Advanced: Multi-Agent Fleet

Oracle supports spawning child agents, each with their own specialty:

| Role | Purpose |
|------|---------|
| Builder | Write code, implement features |
| Researcher | Research, analysis, documentation |
| Designer | UI/UX, visual design |
| Tester | Quality assurance, testing |
| Writer | Content creation |

Each child gets their own Oracle repo with their own `CLAUDE.md` and `ψ/` vault. The parent Oracle orchestrates.

This is an advanced pattern — start with a single Oracle and expand when you need it.

## Requirements

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code)
- [Bun](https://bun.sh) (for running TypeScript tools like the dashboard)
- Git

## FAQ

**Q: Does my Oracle's memory persist between conversations?**
A: Yes — through the `ψ/` vault. Your Oracle writes learnings and handoffs to files, then reads them back at the start of the next session.

**Q: Is my data private?**
A: Yes. The `.gitignore` excludes all personal vault content by default. Only the structure (`.gitkeep` files) is committed. Your memories stay on your machine unless you choose to push them.

**Q: Can I use this with other AI tools (not Claude Code)?**
A: The `CLAUDE.md` convention works with any AI coding tool that reads project-level instruction files. The `ψ/` vault structure is universal markdown — any AI can read it.

**Q: How is this different from just using Claude Code normally?**
A: Without Oracle, Claude forgets everything between sessions. With Oracle, it has structured memory, consistent identity, operating procedures, and a session lifecycle that ensures nothing is lost.

**Q: Can I run multiple Oracles?**
A: Yes. Each Oracle is a separate repo with its own `CLAUDE.md` and `ψ/` vault. They can communicate through their `outbox/` and `inbox/` directories.

## Credits

- **Oracle Mother**: [Nat / Soul-Brews-Studio](https://github.com/Soul-Brews-Studio) — the original open-source Oracle project
- **Philosophy**: "The Oracle Keeps the Human Human"

## License

MIT — Use it, modify it, make it yours.
