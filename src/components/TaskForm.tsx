import { useRef, useState, type FormEvent } from 'react';
import { PlusIcon } from './Icons';

interface TaskFormProps {
  onAdd: (title: string) => void;
}

export function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onAdd(trimmedTitle);
    setTitle('');
    inputRef.current?.focus();
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-input-wrap">
        <label className="visually-hidden" htmlFor="task-title">Новая задача</label>
        <PlusIcon />
        <input
          ref={inputRef}
          id="task-title"
          placeholder="Какие планы? Добавьте задачу"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          autoComplete="off"
        />
      </div>
      <button className="add-button" type="submit" disabled={!title.trim()}>
        <PlusIcon /> Добавить задачу
      </button>
    </form>
  );
}
