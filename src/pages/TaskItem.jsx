import { useState } from 'react'
import { CalendarIcon, CheckIcon, PencilIcon, TrashIcon } from './icons.jsx'

export default function TaskItem({ task, onToggle, onRename, onCancel }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)

  const save = (event) => {
    event.preventDefault()
    const value = title.trim()
    if (value) onRename(value)
    else setTitle(task.title)
    setEditing(false)
  }

  return (
    <li className={`task is-${task.status}`} style={{ '--task-color': task.color }}>
      <button
        type="button"
        className="task-check"
        onClick={onToggle}
        disabled={task.status === 'canceled'}
        aria-label={task.status === 'done' ? 'Вернуть в активные' : 'Отметить выполненной'}
      >
        {task.status === 'done' && <CheckIcon />}
      </button>

      <div className="task-body">
        {editing ? (
          <form onSubmit={save}>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onBlur={save}
              autoFocus
            />
          </form>
        ) : (
          <p className="task-title">{task.title}</p>
        )}
        <p className="task-date">
          <CalendarIcon />
          {task.date}
        </p>
      </div>

      <div className="task-actions">
        <button type="button" onClick={() => setEditing(true)} aria-label="Редактировать">
          <PencilIcon />
        </button>
        <button
          type="button"
          onClick={onCancel}
          aria-label={task.status === 'canceled' ? 'Восстановить' : 'Отменить'}
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  )
}
