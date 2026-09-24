import type { ComponentProps } from 'react'
import styles from './Input.module.css'

type InputProps = ComponentProps<'input'>

function Input({ ...rest }: InputProps) {
  return <input className={styles.input} {...rest} />
}

export default Input
