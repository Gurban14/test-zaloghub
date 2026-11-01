import type { Task } from './types';

const STORAGE_KEY = 'zaloghub-tasks';

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false;

  return (
    'id' in value && typeof value.id === 'string' &&
    'title' in value && typeof value.title === 'string' &&
    value.title.trim().length > 0 &&
    'completed' in value && typeof value.completed === 'boolean'
  );
}

export function loadTasks(): Task[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(saved) ? saved.filter(isTask) : [];
  } catch {
    // Повреждённые данные или запрет localStorage не должны ломать приложение.
    return [];
  }
}

export function saveTasks(tasks: Task[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    return false;
  }
}
