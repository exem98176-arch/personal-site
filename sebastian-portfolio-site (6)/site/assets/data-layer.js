// Shared data layer for the portfolio site.
// Base project data lives in data/projects.json (the "live" deployed data).
// The admin panel lets Sebastian draft edits/additions, stored in this browser's
// localStorage, layered on top of the base data for instant local preview.
// Nothing here syncs across devices/visitors automatically — that's a real
// limitation of a plain static site with no backend/database. To make edits
// permanent for every visitor, use the "Export projects.json" button in the
// admin panel, then replace /data/projects.json in the deployed site files.

const ADMIN_KEY = 'sebtech_admin_projects_v1';

async function loadBaseProjects() {
  const res = await fetch(getDataPath());
  if (!res.ok) throw new Error('Could not load base project data');
  return await res.json();
}

function getDataPath() {
  // works whether the page is at site root or inside /projects/ or similar
  const path = window.location.pathname;
  const depth = path.includes('/projects/') ? '../' : '';
  return depth + 'data/projects.json';
}

function getLocalOverrides() {
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    return raw ? JSON.parse(raw) : { edits: {}, additions: [], deletions: [] };
  } catch (e) {
    return { edits: {}, additions: [], deletions: [] };
  }
}

function saveLocalOverrides(overrides) {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(overrides));
}

async function loadMergedProjects() {
  const base = await loadBaseProjects();
  const overrides = getLocalOverrides();
  let merged = base
    .filter(p => !overrides.deletions.includes(p.slug))
    .map(p => overrides.edits[p.slug] ? { ...p, ...overrides.edits[p.slug] } : p);
  // additions (new projects added via admin, not yet in base file)
  const additionSlugs = new Set(overrides.additions.map(p => p.slug));
  merged = merged.filter(p => !additionSlugs.has(p.slug)); // avoid dupes if already exported
  merged = merged.concat(overrides.additions);
  return merged;
}

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function downloadJSON(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
