import type { ComponentProps } from 'react'
import styles from './Divider.module.css'

type DividerProps = ComponentProps<'p'>

function Divider({ children, ...rest }: DividerProps) {
  return (
    <p className={styles.divider} {...rest}>
      {children}
    </p>
  )
}

export default Divider
