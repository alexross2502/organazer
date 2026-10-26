import { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { apiFetch, getToken } from './api.js'

export default function RequireAuth({ children }) {
  const [status, setStatus] = useState(getToken() ? 'checking' : 'denied')

  useEffect(() => {
    if (status !== 'checking') return
    apiFetch('/auth/me')
      .then(() => setStatus('allowed'))
      .catch(() => setStatus('denied'))
  }, [status])

  if (status === 'denied') return <Navigate to="/" replace />
  if (status === 'checking') return null
  return children
}
