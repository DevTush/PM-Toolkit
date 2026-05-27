const STORAGE_KEY = "pm-engine-projects";

export function loadProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveProject(project) {
  const projects = loadProjects();
  const existing = projects.findIndex((p) => p.id === project.id);
  if (existing >= 0) {
    projects[existing] = project;
  } else {
    projects.unshift(project);
  }
  // keep last 20
  const trimmed = projects.slice(0, 20);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  return trimmed;
}

export function deleteProject(id) {
  const projects = loadProjects().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  return projects;
}

export function createProjectId() {
  return "proj_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 6);
}
