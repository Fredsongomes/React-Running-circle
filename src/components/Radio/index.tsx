import type { ComponentProps } from 'react'
import styles from './Radio.module.css'

type RadioProps = ComponentProps<'input'>

function Radio({ children, id, ...rest }: RadioProps) {
  return (
    <label className={styles.radio} htmlFor={id}>
      <input className={styles.input} type="radio" id={id} {...rest} />
      <span className={styles.circle} />
      {children}
    </label>
  )
}

export default Radio
