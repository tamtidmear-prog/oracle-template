#!/usr/bin/env bun
/**
 * report.ts — Generate Oracle dashboard report as HTML
 *
 * Usage: bun tools/report.ts
 *        bun tools/report.ts --serve    # serve on localhost:8888
 *        bun tools/report.ts --out report.html
 */

import { readdirSync, readFileSync, statSync, existsSync, writeFileSync } from "fs";
import { join, resolve, basename } from "path";

const REPO = resolve(import.meta.dir, "..");
const PSI_LINK = join(REPO, "ψ");
const PSI = existsSync(PSI_LINK) ? resolve(PSI_LINK) : join(REPO, "psi");

// ── Helpers ──

function countFiles(dir: string, ext = ".md"): number {
  try {
    return readdirSync(dir, { recursive: true })
      .filter((f) => String(f).endsWith(ext) && !String(f).endsWith(".gitkeep"))
      .length;
  } catch {
    return 0;
  }
}

function listFiles(dir: string, limit = 20): { name: string; path: string; mtime: Date; size: number; title: string }[] {
  try {
    const files: { name: string; path: string; mtime: Date; size: number; title: string }[] = [];
    for (const entry of readdirSync(dir, { recursive: true })) {
      const p = join(dir, String(entry));
      try {
        const stat = statSync(p);
        if (!stat.isFile() || String(entry).endsWith(".gitkeep")) continue;
        const content = readFileSync(p, "utf-8");
        const title = content.split("\n").find((l) => l.startsWith("#"))?.replace(/^#+\s*/, "") || basename(p);
        files.push({ name: String(entry), path: p, mtime: stat.mtime, size: stat.size, title });
      } catch {}
    }
    return files.sort((a, b) => b.mtime.getTime() - a.mtime.getTime()).slice(0, limit);
  } catch {
    return [];
  }
}

function readTitle(path: string): string {
  try {
    const content = readFileSync(path, "utf-8");
    return content.split("\n").find((l) => l.startsWith("#"))?.replace(/^#+\s*/, "") || basename(path);
  } catch {
    return basename(path);
  }
}

function getIdentity(): { name: string; human: string; purpose: string; theme: string; born: string } {
  try {
    const claude = readFileSync(join(REPO, "CLAUDE.md"), "utf-8");
    const name = claude.match(/\*\*I am:\*\*\s*(.+?)(?:\s*—|$)/m)?.[1]?.replace(/\{\{.*?\}\}/g, "Not Set") || "Not Set";
    const human = claude.match(/\*\*Human:\*\*\s*(.+)/m)?.[1]?.replace(/\{\{.*?\}\}/g, "Not Set") || "Not Set";
    const purpose = claude.match(/\*\*Purpose:\*\*\s*(.+)/m)?.[1]?.replace(/\{\{.*?\}\}/g, "Not Set") || "Not Set";
    const theme = claude.match(/\*\*Theme:\*\*\s*(.+)/m)?.[1]?.replace(/\{\{.*?\}\}/g, "Not Set") || "Not Set";
    const born = claude.match(/\*\*Born:\*\*\s*(.+)/m)?.[1]?.replace(/\{\{.*?\}\}/g, "Not Set") || "Not Set";
    return { name, human, purpose, theme, born };
  } catch {
    return { name: "Not Set", human: "Not Set", purpose: "Not Set", theme: "Not Set", born: "Not Set" };
  }
}

function getGitInfo(): { branch: string; lastCommit: string; dirty: number; totalCommits: number } {
  try {
    const branch = Bun.spawnSync(["git", "branch", "--show-current"], { cwd: REPO }).stdout.toString().trim();
    const lastCommit = Bun.spawnSync(["git", "log", "--oneline", "-1"], { cwd: REPO }).stdout.toString().trim();
    const dirty = Bun.spawnSync(["git", "status", "--short"], { cwd: REPO }).stdout.toString().trim().split("\n").filter(Boolean).length;
    const totalCommits = parseInt(Bun.spawnSync(["git", "rev-list", "--count", "HEAD"], { cwd: REPO }).stdout.toString().trim()) || 0;
    return { branch, lastCommit, dirty, totalCommits };
  } catch {
    return { branch: "unknown", lastCommit: "none", dirty: 0, totalCommits: 0 };
  }
}

function getRecentActivity(days = 30): { date: string; count: number }[] {
  const activity: Record<string, number> = {};
  const dirs = ["memory/retrospectives", "memory/learnings", "memory/logs", "inbox/handoff"];
  for (const dir of dirs) {
    try {
      for (const entry of readdirSync(join(PSI, dir), { recursive: true })) {
        const match = String(entry).match(/^(\d{4}-\d{2}-\d{2})/);
        if (match) activity[match[1]] = (activity[match[1]] || 0) + 1;
      }
    } catch {}
  }
  const sorted = Object.entries(activity).sort((a, b) => b[0].localeCompare(a[0])).slice(0, days);
  return sorted.map(([date, count]) => ({ date, count }));
}

// ── Collect Data ──

const identity = getIdentity();
const git = getGitInfo();

const vaultStats = {
  resonance: countFiles(join(PSI, "memory/resonance")),
  learnings: countFiles(join(PSI, "memory/learnings")),
  retrospectives: countFiles(join(PSI, "memory/retrospectives")),
  logs: countFiles(join(PSI, "memory/logs")),
  inbox: countFiles(join(PSI, "inbox")),
  handoffs: countFiles(join(PSI, "inbox/handoff")),
  active: countFiles(join(PSI, "active")),
  writing: countFiles(join(PSI, "writing")),
  archive: countFiles(join(PSI, "archive")),
  lab: countFiles(join(PSI, "lab")),
  outbox: countFiles(join(PSI, "outbox")),
  learn: countFiles(join(PSI, "learn")),
  shared: countFiles(join(PSI, "shared")),
  later: countFiles(join(PSI, "later")),
};
const totalFiles = Object.values(vaultStats).reduce((a, b) => a + b, 0);

const recentRetros = listFiles(join(PSI, "memory/retrospectives"), 10);
const recentLearnings = listFiles(join(PSI, "memory/learnings"), 10);
const recentHandoffs = listFiles(join(PSI, "inbox/handoff"), 5);
const activity = getRecentActivity(60);

const now = new Date();
const generated = now.toISOString().replace("T", " ").slice(0, 19);

// Pre-compute heatmap HTML (avoids nested template literals)
function buildHeatmap(activityData: { date: string; count: number }[]): string {
  if (activityData.length === 0) {
    return '<div style="color: var(--text2); font-style: italic;">No activity yet — start working and your Oracle will track sessions here</div>';
  }
  const actMap: Record<string, number> = {};
  for (const a of activityData) actMap[a.date] = a.count;
  const days: string[] = [];
  const end = new Date();
  for (let i = 59; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    const count = Math.min(actMap[ds] || 0, 5);
    const total = actMap[ds] || 0;
    days.push('<div class="heat-day" data-count="' + count + '" title="' + ds + ": " + total + ' files"></div>');
  }
  return '<div class="heatmap">' + days.join("\n      ") + "</div>";
}
const heatmapHtml = buildHeatmap(activity);

function fileListHtml(files: { title: string; mtime: Date }[], emptyMsg: string): string {
  if (files.length === 0) return '<li class="empty">' + emptyMsg + "</li>";
  return files.map((f) => '<li><span class="title">' + f.title + '</span><span class="date">' + f.mtime.toISOString().slice(0, 10) + "</span></li>").join("\n        ");
}

// ── Generate HTML ──

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${identity.name} — Oracle Dashboard</title>
<style>
  :root {
    --bg: #0a0a0f;
    --surface: #12121a;
    --surface2: #1a1a28;
    --border: #2a2a3a;
    --text: #e0e0e8;
    --text2: #8888a0;
    --accent: #7c6df0;
    --accent2: #5a4fd0;
    --green: #4ade80;
    --amber: #fbbf24;
    --red: #f87171;
    --blue: #60a5fa;
    --cyan: #22d3ee;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'SF Mono', 'Cascadia Code', 'JetBrains Mono', monospace;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    padding: 2rem;
  }
  .container { max-width: 1200px; margin: 0 auto; }

  /* Header */
  .header {
    text-align: center;
    padding: 2rem 0 1.5rem;
    border-bottom: 1px solid var(--border);
    margin-bottom: 2rem;
  }
  .header h1 {
    font-size: 2rem;
    color: var(--accent);
    letter-spacing: 0.05em;
  }
  .header .theme {
    color: var(--text2);
    font-style: italic;
    margin-top: 0.5rem;
  }
  .header .meta {
    color: var(--text2);
    font-size: 0.8rem;
    margin-top: 0.75rem;
  }

  /* Identity Cards */
  .identity-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }
  .id-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1rem;
  }
  .id-card .label { color: var(--text2); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
  .id-card .value { color: var(--text); font-size: 1.1rem; margin-top: 0.25rem; }
  .id-card .value.unset { color: var(--text2); font-style: italic; }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.75rem;
    margin-bottom: 2rem;
  }
  .stat {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
  }
  .stat .number {
    font-size: 1.8rem;
    font-weight: bold;
    color: var(--accent);
  }
  .stat .label {
    font-size: 0.7rem;
    color: var(--text2);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-top: 0.25rem;
  }

  /* Sections */
  .section {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .section h2 {
    font-size: 1rem;
    color: var(--accent);
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
  }

  /* File List */
  .file-list { list-style: none; }
  .file-list li {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .file-list li:last-child { border-bottom: none; }
  .file-list .title { color: var(--text); }
  .file-list .date { color: var(--text2); font-size: 0.8rem; }
  .file-list .empty { color: var(--text2); font-style: italic; padding: 1rem 0; }

  /* Activity Heatmap */
  .heatmap {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    margin-top: 0.5rem;
  }
  .heat-day {
    width: 14px;
    height: 14px;
    border-radius: 2px;
    background: var(--surface2);
    position: relative;
  }
  .heat-day[data-count="1"] { background: #1a3a2a; }
  .heat-day[data-count="2"] { background: #2a5a3a; }
  .heat-day[data-count="3"] { background: #3a7a4a; }
  .heat-day[data-count="4"] { background: var(--green); opacity: 0.7; }
  .heat-day[data-count="5"] { background: var(--green); }
  .heat-day:hover::after {
    content: attr(title);
    position: absolute;
    bottom: 120%;
    left: 50%;
    transform: translateX(-50%);
    background: var(--surface2);
    color: var(--text);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.65rem;
    white-space: nowrap;
    border: 1px solid var(--border);
    z-index: 10;
  }

  /* Knowledge Flow */
  .flow {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    padding: 1rem 0;
  }
  .flow-node {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.5rem 1rem;
    text-align: center;
    min-width: 100px;
  }
  .flow-node .count {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--accent);
  }
  .flow-node .name {
    font-size: 0.7rem;
    color: var(--text2);
    text-transform: uppercase;
  }
  .flow-arrow { color: var(--text2); font-size: 1.2rem; }

  /* Git */
  .git-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.75rem;
  }
  .git-item { display: flex; flex-direction: column; }
  .git-item .label { color: var(--text2); font-size: 0.75rem; text-transform: uppercase; }
  .git-item .value { color: var(--text); margin-top: 0.25rem; }
  .dirty { color: var(--amber); }
  .clean { color: var(--green); }

  /* Two columns */
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  @media (max-width: 768px) {
    .two-col { grid-template-columns: 1fr; }
    body { padding: 1rem; }
  }

  /* Footer */
  .footer {
    text-align: center;
    color: var(--text2);
    font-size: 0.75rem;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
  }
</style>
</head>
<body>
<div class="container">

  <div class="header">
    <h1>ψ ${identity.name}</h1>
    <div class="theme">"${identity.theme}"</div>
    <div class="meta">Generated ${generated} · ${totalFiles} vault files · ${git.totalCommits} commits</div>
  </div>

  <!-- Identity -->
  <div class="identity-grid">
    <div class="id-card">
      <div class="label">Oracle</div>
      <div class="value ${identity.name === 'Not Set' ? 'unset' : ''}">${identity.name}</div>
    </div>
    <div class="id-card">
      <div class="label">Human</div>
      <div class="value ${identity.human === 'Not Set' ? 'unset' : ''}">${identity.human}</div>
    </div>
    <div class="id-card">
      <div class="label">Purpose</div>
      <div class="value ${identity.purpose === 'Not Set' ? 'unset' : ''}">${identity.purpose}</div>
    </div>
    <div class="id-card">
      <div class="label">Born</div>
      <div class="value ${identity.born === 'Not Set' ? 'unset' : ''}">${identity.born}</div>
    </div>
  </div>

  <!-- Vault Stats -->
  <div class="stats-grid">
    <div class="stat"><div class="number">${totalFiles}</div><div class="label">Total Files</div></div>
    <div class="stat"><div class="number">${vaultStats.resonance}</div><div class="label">Resonance</div></div>
    <div class="stat"><div class="number">${vaultStats.learnings}</div><div class="label">Learnings</div></div>
    <div class="stat"><div class="number">${vaultStats.retrospectives}</div><div class="label">Retros</div></div>
    <div class="stat"><div class="number">${vaultStats.handoffs}</div><div class="label">Handoffs</div></div>
    <div class="stat"><div class="number">${vaultStats.inbox}</div><div class="label">Inbox</div></div>
    <div class="stat"><div class="number">${vaultStats.active}</div><div class="label">Active</div></div>
    <div class="stat"><div class="number">${vaultStats.archive}</div><div class="label">Archive</div></div>
  </div>

  <!-- Knowledge Flow -->
  <div class="section">
    <h2>Knowledge Flow</h2>
    <div class="flow">
      <div class="flow-node"><div class="count">${vaultStats.active}</div><div class="name">Active</div></div>
      <div class="flow-arrow">→</div>
      <div class="flow-node"><div class="count">${vaultStats.logs}</div><div class="name">Logs</div></div>
      <div class="flow-arrow">→</div>
      <div class="flow-node"><div class="count">${vaultStats.retrospectives}</div><div class="name">Retros</div></div>
      <div class="flow-arrow">→</div>
      <div class="flow-node"><div class="count">${vaultStats.learnings}</div><div class="name">Learnings</div></div>
      <div class="flow-arrow">→</div>
      <div class="flow-node"><div class="count">${vaultStats.resonance}</div><div class="name">Resonance</div></div>
    </div>
  </div>

  <!-- Activity Heatmap -->
  <div class="section">
    <h2>Activity (last 60 days)</h2>
    ${heatmapHtml}
  </div>

  <!-- Git Info -->
  <div class="section">
    <h2>Git Status</h2>
    <div class="git-info">
      <div class="git-item"><div class="label">Branch</div><div class="value">${git.branch}</div></div>
      <div class="git-item"><div class="label">Last Commit</div><div class="value">${git.lastCommit}</div></div>
      <div class="git-item"><div class="label">Working Tree</div><div class="value ${git.dirty > 0 ? 'dirty' : 'clean'}">${git.dirty > 0 ? git.dirty + ' uncommitted files' : 'Clean ✓'}</div></div>
      <div class="git-item"><div class="label">Total Commits</div><div class="value">${git.totalCommits}</div></div>
    </div>
  </div>

  <!-- Recent Files -->
  <div class="two-col">
    <div class="section">
      <h2>Recent Retrospectives</h2>
      <ul class="file-list">
        ${fileListHtml(recentRetros, "No retrospectives yet")}
      </ul>
    </div>
    <div class="section">
      <h2>Recent Learnings</h2>
      <ul class="file-list">
        ${fileListHtml(recentLearnings, "No learnings yet")}
      </ul>
    </div>
  </div>

  <!-- Handoffs -->
  <div class="section">
    <h2>Recent Handoffs</h2>
    <ul class="file-list">
      ${fileListHtml(recentHandoffs, "No handoffs yet — your first session will create one")}
    </ul>
  </div>

  <div class="footer">
    Oracle Dashboard · Generated by <code>bun tools/report.ts</code>
  </div>

</div>
</body>
</html>`;

// ── Output ──

const args = process.argv.slice(2);

if (args.includes("--serve")) {
  const port = 8888;
  Bun.serve({
    port,
    fetch() {
      return new Response(html, { headers: { "Content-Type": "text/html" } });
    },
  });
  console.log(`Oracle Dashboard → http://localhost:${port}`);
  console.log("Press Ctrl+C to stop");
} else {
  const outArg = args.indexOf("--out");
  const outPath = outArg >= 0 && args[outArg + 1] ? args[outArg + 1] : join(REPO, ".tmp", "oracle-report.html");

  // Ensure output directory exists
  const outDir = resolve(outPath, "..");
  try { require("fs").mkdirSync(outDir, { recursive: true }); } catch {}

  writeFileSync(outPath, html);
  console.log(`Oracle Dashboard → ${outPath}`);

  // Try to open in browser
  try {
    const opener = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
    Bun.spawn([opener, outPath]);
  } catch {
    console.log("Open the file in your browser to view the dashboard");
  }
}
