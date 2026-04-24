# ψ/ — Oracle Brain (Vault)

This is your Oracle's brain. Knowledge flows through it:

```
active/ → memory/logs → memory/retrospectives → memory/learnings → memory/resonance
(research → snapshot → session → patterns → soul)
```

## Structure

| Directory | Purpose | Example Content |
|-----------|---------|-----------------|
| `inbox/` | Incoming messages, tasks | Tasks from other agents, notifications |
| `inbox/handoff/` | Session handoffs | "Here's where I left off" notes |
| `memory/resonance/` | WHO your Oracle is | Soul documents, identity, philosophy |
| `memory/learnings/` | PATTERNS it discovered | "Never do X because Y" insights |
| `memory/retrospectives/` | SESSION journals | What happened, what was learned |
| `memory/logs/` | Ephemeral moments | Quick captures, timestamps |
| `active/` | Current research focus | Work-in-progress notes |
| `writing/` | Drafts in progress | Documents being written |
| `outbox/` | Outgoing messages | Messages to other agents or humans |
| `shared/` | Cross-agent shared items | Files shared between multiple Oracles |
| `archive/` | Completed work | Finished projects moved here |
| `learn/` | Study materials | Reference docs, tutorials |
| `lab/` | Experiments | Try things without consequences |
| `later/` | Parked / deferred items | Ideas to revisit later |

## Knowledge Flow

```
         ┌──────────┐
         │ active/  │  ← Raw research, current focus
         └────┬─────┘
              ▼
       ┌──────────────┐
       │ memory/logs/  │  ← Quick snapshots, timestamps
       └──────┬───────┘
              ▼
  ┌────────────────────────┐
  │ memory/retrospectives/ │  ← Session summaries, decisions
  └───────────┬────────────┘
              ▼
    ┌───────────────────┐
    │ memory/learnings/ │  ← Distilled patterns, rules
    └─────────┬─────────┘
              ▼
    ┌────────────────────┐
    │ memory/resonance/  │  ← Core identity, soul
    └────────────────────┘
```

## Privacy

All content in `ψ/` is **gitignored by default** (except this README and `.gitkeep` files). Your Oracle's memories stay on your machine unless you explicitly choose to commit them.

## Naming Convention

Files follow the pattern: `YYYY-MM-DD_short-description.md`

Examples:
- `2026-04-24_learned-api-caching-pattern.md`
- `2026-04-24_session-retrospective.md`
- `2026-04-24_handoff-to-next-session.md`
