import type { ComponentProps } from 'react'
import styles from './Label.module.css'

type LabelProps = ComponentProps<'label'>

function Label({ children, ...rest }: LabelProps) {
  return (
    <label className={styles.label} {...rest}>
      {children}
    </label>
  )
}

export default Label
