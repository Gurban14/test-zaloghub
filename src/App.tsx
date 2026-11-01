import { useEffect, useState } from 'react';
import { TaskForm } from './components/TaskForm';
import { TaskItem } from './components/TaskItem';
import { ArrowIcon, CheckIcon, BrandIcon, StackIcon } from './components/Icons';
import { loadTasks, saveTasks } from './storage';
import type { Task, TaskFilter } from './types';

const filters: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'active', label: 'Активные' },
  { value: 'completed', label: 'Выполненные' },
];

const emptyMessages: Record<TaskFilter, { title: string; description: string }> = {
  all: {
    title: 'Задач пока нет',
    description: 'Добавьте первую задачу в поле выше.',
  },
  active: {
    title: 'Нет активных задач',
    description: 'Новые задачи появятся здесь.',
  },
  completed: {
    title: 'Нет выполненных задач',
    description: 'Отметьте выполненную задачу, чтобы увидеть её в этом списке.',
  },
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    setStorageError(!saveTasks(tasks));
  }, [tasks]);

  const completedCount = tasks.filter((task) => task.completed).length;
  const activeCount = tasks.length - completedCount;
  const counts = { all: tasks.length, active: activeCount, completed: completedCount };
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });
  const progress = tasks.length ? Math.round(completedCount / tasks.length * 100) : 0;
  const emptyMessage = emptyMessages[filter];

  function addTask(title: string) {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setTasks((current) => [
      ...current,
      { id: crypto.randomUUID(), title: trimmedTitle, completed: false },
    ]);
    setFilter('all');
  }

  function toggleTask(id: string) {
    setTasks((current) => current.map((task) => (
      task.id === id ? { ...task, completed: !task.completed } : task
    )));
  }

  function deleteTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="./" aria-label="ZalogHub — главная">
            <span className="brand-mark"><BrandIcon /></span>
            ZalogHub
          </a>
          <span className="header-section">Личный список задач</span>
          <span className="workspace-badge"><span /> Личный список</span>
        </div>
      </header>

      <main>
        <section className="overview" aria-labelledby="page-title">
          <div className="intro">
            <h1 id="page-title">С возвращением!</h1>
            <p className="intro-description">Ваш список задач и текущий прогресс.</p>
            <div className="overall-progress">
              <div className="progress-heading">
                <span>Общий прогресс</span>
                <strong>{progress}%</strong>
              </div>
              <div className="progress-track" role="progressbar" aria-label="Общий прогресс" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                {Array.from({ length: 6 }, (_, index) => (
                  <span className="progress-segment" key={index}>
                    <span style={{ width: `${Math.min(100, Math.max(0, progress * 6 - index * 100))}%` }} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="overview-cards" role="group" aria-label="Быстрые фильтры">
            <button className="overview-card active-card" type="button" onClick={() => setFilter('active')} aria-pressed={filter === 'active'}>
              <span className="card-topline">
                <span className="card-icon"><StackIcon /></span>
                <ArrowIcon />
              </span>
              <span className="card-name">В процессе</span>
              <span className="card-count">{activeCount.toString().padStart(2, '0')}</span>
              <span className="card-footer"><span className="status-dot" /> Активные задачи</span>
            </button>
            <button className="overview-card completed-card" type="button" onClick={() => setFilter('completed')} aria-pressed={filter === 'completed'}>
              <span className="card-topline">
                <span className="card-icon"><CheckIcon /></span>
                <ArrowIcon />
              </span>
              <span className="card-name">Уже сделано</span>
              <span className="card-count">{completedCount.toString().padStart(2, '0')}</span>
              <span className="card-footer"><span className="status-dot" /> Выполненные задачи</span>
            </button>
          </div>
        </section>

        <section className="tasks-panel" aria-labelledby="list-title">
          <div className="panel-heading">
            <div>
              <h2 id="list-title">Мои задачи <span className="total-count">{tasks.length}</span></h2>
            </div>
            <div className="filters" role="group" aria-label="Фильтр задач">
              {filters.map(({ value, label }) => (
                <button
                  key={value}
                  className={`filter-button${filter === value ? ' is-selected' : ''}`}
                  type="button"
                  aria-pressed={filter === value}
                  onClick={() => setFilter(value)}
                >
                  {label}<span className="filter-count">{counts[value]}</span>
                </button>
              ))}
            </div>
          </div>

          <TaskForm onAdd={addTask} />

          <div className="list-heading" aria-hidden="true">
            <span>ВАШ СПИСОК</span>
            <span>{visibleTasks.length.toString().padStart(2, '0')}</span>
          </div>

          {visibleTasks.length > 0 ? (
            <ul className="task-list">
              {visibleTasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
              ))}
            </ul>
          ) : (
            <div className="empty-state" role="status">
              <div className="empty-icon" aria-hidden="true"><StackIcon /></div>
              <h3>{emptyMessage.title}</h3>
              <p>{emptyMessage.description}</p>
            </div>
          )}

          <div className="panel-footer">
            <span aria-live="polite">Осталось выполнить <strong>{activeCount}</strong></span>
            <span className="keyboard-hint"><kbd>Enter</kbd> чтобы добавить задачу</span>
          </div>
        </section>

        <p className={`storage-note${storageError ? ' storage-error' : ''}`} role="status">
          {storageError ? (
            'Не удалось сохранить задачи. Они доступны до обновления страницы.'
          ) : (
            <><CheckIcon /> Всё сохраняется автоматически в этом браузере</>
          )}
        </p>
      </main>

      <footer className="site-footer">
        <span>ZalogHub</span>
      </footer>
    </div>
  );
}
