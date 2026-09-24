import type { ComponentProps } from 'react'
import styles from './Textarea.module.css'

type TextareaProps = ComponentProps<'textarea'>

function Textarea({ ...rest }: TextareaProps) {
  return <textarea className={styles.textarea} {...rest} />
}

export default Textarea
