import type { ComponentProps } from 'react'
import styles from './Columns.module.css'

type ColumnsProps = ComponentProps<'div'> & {
  mediaSize?: 'fixed' | 'fluid'
}

function Columns({ children, mediaSize = 'fixed', ...rest }: ColumnsProps) {
  return (
    <div className={`${styles.columns} ${styles[mediaSize]}`} {...rest}>
      {children}
    </div>
  )
}

export default Columns
