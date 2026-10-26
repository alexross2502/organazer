const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function PawIcon() {
  return (
    <svg className="icon-paw" viewBox="0 0 64 64" fill="currentColor">
      <ellipse cx="14" cy="26" rx="6" ry="8" />
      <ellipse cx="25" cy="13" rx="6" ry="8" />
      <ellipse cx="39" cy="13" rx="6" ry="8" />
      <ellipse cx="50" cy="26" rx="6" ry="8" />
      <path d="M32 30c-9 0-17 10-17 18 0 6 5 9 10 8 3-1 5-2 7-2s4 1 7 2c5 1 10-2 10-8 0-8-8-18-17-18Z" />
    </svg>
  )
}

export function CatIcon() {
  return (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M4 20V8l3-4 3 4h4l3-4 3 4v12Z" />
      <circle cx="9" cy="13" r="0.8" fill="currentColor" />
      <circle cx="15" cy="13" r="0.8" fill="currentColor" />
      <path d="M11 16.5c.5.5 1.5.5 2 0" />
    </svg>
  )
}

export function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" {...stroke} strokeWidth={3}>
      <path d="m6 12.5 4 4 8-9" />
    </svg>
  )
}

export function CrossIcon() {
  return (
    <svg viewBox="0 0 24 24" {...stroke} strokeWidth={3}>
      <path d="m7 7 10 10M17 7 7 17" />
    </svg>
  )
}

export function MountainIcon() {
  return (
    <svg viewBox="0 0 48 24" {...stroke} strokeWidth={1.5}>
      <path d="M2 22 18 4l10 12 5-5 13 11Z" />
      <path d="m11 12 5 3 4-4" />
    </svg>
  )
}

export function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 10h16M9 3v4M15 3v4" />
    </svg>
  )
}

export function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M16 4l4 4L8 20H4v-4Z" />
      <path d="m13 7 4 4" />
    </svg>
  )
}

export function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v5M14 11v5" />
    </svg>
  )
}

export function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2.5}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}
