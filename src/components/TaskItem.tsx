import type { Task } from '../types';
import { CheckIcon, TrashIcon } from './Icons';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className={`task-item${task.completed ? ' is-completed' : ''}`}>
      <label className="task-label">
        <input
          className="task-checkbox"
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <span className="checkbox-visual"><CheckIcon /></span>
        <span className="task-title">{task.title}</span>
      </label>
      <span className="task-status"><span className="status-dot" />{task.completed ? 'Выполнено' : 'В процессе'}</span>
      <button
        className="delete-button"
        type="button"
        onClick={() => onDelete(task.id)}
        aria-label={`Удалить задачу «${task.title}»`}
        title="Удалить задачу"
      >
        <TrashIcon />
      </button>
    </li>
  );
}
