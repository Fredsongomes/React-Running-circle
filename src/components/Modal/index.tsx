import type { ComponentProps, ReactNode } from 'react'
import { useEffect, useId } from 'react'
import { X } from 'lucide-react'
import styles from './Modal.module.css'

type ModalProps = ComponentProps<'div'> & {
  open?: boolean
  onClose?: () => void
  title?: ReactNode
}

function Modal({ open = false, onClose, title, children, ...rest }: ModalProps) {
  const titleId = useId()

  // Fecha com Esc
  useEffect(() => {
    if (!open || !onClose) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose?.()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        {...rest}
      >
        <header className={styles.header}>
          <p id={titleId} className={styles.title}>{title}</p>
          <button
            className={styles.close}
            type="button"
            aria-label="Fechar"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}

export default Modal
