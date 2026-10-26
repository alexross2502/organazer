import { useEffect, useState } from 'react'
import {
  getPermission,
  getSubscription,
  isIos,
  isPushSupported,
  isStandalone,
  sendTest,
  subscribe,
  unsubscribe,
} from '../push/push.js'

function initialState() {
  if (isIos() && !isStandalone()) return 'install'
  if (!isPushSupported()) return 'unsupported'
  if (getPermission() === 'denied') return 'denied'
  return 'checking'
}

export default function PushControls() {
  const [state, setState] = useState(initialState)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (state !== 'checking') return
    getSubscription()
      .then((subscription) => setState(subscription ? 'subscribed' : 'idle'))
      .catch(() => setState('idle'))
  }, [state])

  const run = async (action) => {
    setBusy(true)
    setMessage('')
    try {
      await action()
    } catch (error) {
      if (getPermission() === 'denied') setState('denied')
      else setMessage(error.message)
    } finally {
      setBusy(false)
    }
  }

  const enable = () =>
    run(async () => {
      await subscribe()
      setState('subscribed')
    })

  const disable = () =>
    run(async () => {
      await unsubscribe()
      setState('idle')
    })

  const test = () =>
    run(async () => {
      const { sent } = await sendTest()
      setMessage(sent ? 'Отправлено' : 'Нет активных подписок')
    })

  if (state === 'checking') return null

  return (
    <div className="home-push">
      {state === 'install' && (
        <p>Чтобы получать уведомления, открой меню «Поделиться» в Safari и выбери «На экран Домой», затем запусти приложение с иконки.</p>
      )}
      {state === 'unsupported' && <p>Уведомления не поддерживаются в этом браузере</p>}
      {state === 'denied' && <p>Уведомления запрещены. Разреши их в настройках устройства для этого приложения.</p>}
      {state === 'idle' && (
        <button type="button" onClick={enable} disabled={busy}>
          Включить уведомления
        </button>
      )}
      {state === 'subscribed' && (
        <div className="home-push-actions">
          <button type="button" onClick={test} disabled={busy}>
            Тестовый пуш
          </button>
          <button type="button" onClick={disable} disabled={busy}>
            Выключить
          </button>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  )
}
