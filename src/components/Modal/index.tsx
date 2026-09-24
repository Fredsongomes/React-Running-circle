import type { ComponentProps, ReactNode } from 'react'
import { X } from 'lucide-react'
import styles from './Modal.module.css'

type ModalProps = ComponentProps<'div'> & {
  open?: boolean
  onClose?: () => void
  title?: ReactNode
}

function Modal({ open = false, onClose, title, children, ...rest }: ModalProps) {
  if (!open) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.panel}
        onClick={(event) => event.stopPropagation()}
        {...rest}
      >
        <header className={styles.header}>
          <p className={styles.title}>{title}</p>
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
