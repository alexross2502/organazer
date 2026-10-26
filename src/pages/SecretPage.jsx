import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { getToken, login } from '../auth/api.js'
import './SecretPage.css'

export default function SecretPage() {
  const navigate = useNavigate()
  const [secret, setSecret] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (getToken()) return <Navigate to="/home" replace />

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(secret)
      navigate('/home', { replace: true })
    } catch (err) {
      setError(err.message === 'Wrong secret' ? 'Неверное слово' : err.message)
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={handleSubmit}>
        <h2>Секретное слово</h2>
        <input
          type="password"
          value={secret}
          onChange={(event) => setSecret(event.target.value)}
          placeholder="Введи слово"
          autoFocus
        />
        {error && <p className="modal-error">{error}</p>}
        <button type="submit" disabled={loading || !secret}>
          {loading ? 'Проверяю…' : 'Войти'}
        </button>
      </form>
    </div>
  )
}
