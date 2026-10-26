import { useState } from 'react'
import TaskItem from './TaskItem.jsx'
import PushControls from './PushControls.jsx'
import { CatIcon, CheckIcon, CrossIcon, MountainIcon, PawIcon, PlusIcon } from './icons.jsx'
import './HomePage.css'

const filters = [
  { id: 'active', label: 'Активные' },
  { id: 'done', label: 'Выполненные', icon: <CheckIcon /> },
  { id: 'canceled', label: 'Отмененные', icon: <CrossIcon /> },
]

const colors = ['#6366f1', '#22c55e', '#a855f7', '#f59e0b', '#f43f5e', '#60a5fa']

const initialTasks = [
  { id: 1, title: 'Сходить в спортзал', date: 'Сегодня, 18:00', color: colors[0], status: 'active' },
  { id: 2, title: 'Купить продукты', date: 'Сегодня, 20:00', color: colors[1], status: 'active' },
  { id: 3, title: 'Почитать книгу', date: 'Завтра, 10:00', color: colors[2], status: 'active' },
  { id: 4, title: 'Погулять с друзьями', date: 'Вчера, 19:00', color: colors[1], status: 'done' },
  { id: 5, title: 'Выучить английский', date: 'Завтра, 15:00', color: colors[3], status: 'active' },
  { id: 6, title: 'Сделать домашнее задание', date: 'Вчера, 17:00', color: colors[1], status: 'done' },
  { id: 7, title: 'Позвонить родителям', date: 'Завтра, 12:00', color: colors[4], status: 'active' },
  { id: 8, title: 'Посмотреть новый сериал', date: 'Сегодня, 22:00', color: colors[5], status: 'active' },
]

export default function HomePage() {
  const [tasks, setTasks] = useState(initialTasks)
  const [filter, setFilter] = useState('active')
  const [draft, setDraft] = useState(null)

  const visibleTasks = tasks.filter((task) =>
    filter === 'active' ? task.status !== 'canceled' : task.status === filter,
  )

  const updateTask = (id, changes) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, ...changes } : task)))
  }

  const addTask = (event) => {
    event.preventDefault()
    const title = draft.trim()
    if (title) {
      setTasks((current) => [
        ...current,
        {
          id: Date.now(),
          title,
          date: 'Сегодня',
          color: colors[current.length % colors.length],
          status: 'active',
        },
      ])
    }
    setDraft(null)
  }

  return (
    <div className="home">
      <header className="home-header">
        <div className="home-title">
          <PawIcon />
          <div>
            <h1>Todo List</h1>
            <p>Планы на сегодня — шаги к большому</p>
          </div>
        </div>
        <div className="home-scene" aria-hidden="true">
          <svg viewBox="0 0 200 120" preserveAspectRatio="xMaxYMax slice">
            <defs>
              <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1e1b4b" />
                <stop offset="0.6" stopColor="#6d4aa8" />
                <stop offset="1" stopColor="#d9819b" />
              </linearGradient>
            </defs>
            <rect x="40" y="0" width="150" height="104" fill="url(#sky)" />
            <path d="M40 104 L80 62 L104 84 L132 48 L190 104 Z" fill="#3b3486" />
            <path d="M40 104 L70 86 L96 98 L130 76 L190 104 Z" fill="#26235e" />
            <path d="M168 22 a9 9 0 1 0 8 12 a7 7 0 1 1 -8 -12 Z" fill="#f4b27a" />
            <path d="M128 18 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill="#f4b27a" />
            <rect x="112" y="0" width="5" height="104" fill="#14122e" />
            <rect x="36" y="0" width="5" height="104" fill="#14122e" />
            <rect x="186" y="0" width="5" height="104" fill="#14122e" />
            <rect x="0" y="102" width="200" height="18" fill="#14122e" />
            <path
              d="M120 120 C120 96 132 86 146 84 L150 70 L158 82 L172 82 L180 70 L183 86 C194 92 200 104 200 120 Z"
              fill="#06060f"
            />
            <circle cx="160" cy="96" r="5" fill="#f59e0b" />
            <circle cx="176" cy="96" r="5" fill="#f59e0b" />
            <circle cx="160" cy="96" r="2" fill="#06060f" />
            <circle cx="176" cy="96" r="2" fill="#06060f" />
          </svg>
        </div>
      </header>

      <nav className="home-menu">
        <button type="button" className="home-cat">
          <CatIcon />
          <span>Переключиться на котика</span>
        </button>
        {filters.map(({ id, label, icon }) => (
          <button
            key={id}
            type="button"
            className={`home-filter ${filter === id ? 'is-active' : ''}`}
            onClick={() => setFilter(id)}
          >
            {icon ?? <span className="home-dot" />}
            {label}
          </button>
        ))}
      </nav>

      <div className="home-divider">
        <span />
        <MountainIcon />
        <span />
      </div>

      <ul className="task-list">
        {visibleTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => updateTask(task.id, { status: task.status === 'done' ? 'active' : 'done' })}
            onRename={(title) => updateTask(task.id, { title })}
            onCancel={() =>
              updateTask(task.id, { status: task.status === 'canceled' ? 'active' : 'canceled' })
            }
          />
        ))}
        {visibleTasks.length === 0 && <li className="task-empty">Здесь пока пусто</li>}
      </ul>

      <div className="home-add">
        {draft === null ? (
          <button type="button" onClick={() => setDraft('')}>
            <PlusIcon />
            Добавить задачу
          </button>
        ) : (
          <form onSubmit={addTask}>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onBlur={addTask}
              placeholder="Что нужно сделать?"
              autoFocus
            />
          </form>
        )}
      </div>

      <PushControls />
    </div>
  )
}
