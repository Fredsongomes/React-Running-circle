import type { ComponentProps } from 'react'
import { X } from 'lucide-react'
import styles from './FileItem.module.css'

type FileItemProps = ComponentProps<'p'> & {
  onRemove?: () => void
}

function FileItem({ children, onRemove, ...rest }: FileItemProps) {
  return (
    <p className={styles.fileItem} {...rest}>
      <span className={styles.name}>{children}</span>
      <button
        className={styles.remove}
        type="button"
        aria-label="Remover arquivo"
        onClick={onRemove}
      >
        <X size={16} />
      </button>
    </p>
  )
}

export default FileItem
