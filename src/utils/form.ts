import { startTransition, type FormEvent } from 'react'

/**
 * Envia o form para uma action do `useActionState` SEM o reset automático
 * que o React 19 aplica em `<form action>`. Útil quando o form tem upload
 * de arquivo: o reset limparia o <input type="file"> mas não o preview,
 * e o usuário perderia tudo o que digitou ao errar uma validação.
 */
export function submitWithoutReset(action: (formData: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    startTransition(() => action(formData))
  }
}
