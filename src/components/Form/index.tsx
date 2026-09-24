import type { ComponentProps } from 'react'
import styles from './Form.module.css'

type FormProps = ComponentProps<'form'>

function Form({ children, ...rest }: FormProps) {
  return (
    <form className={styles.form} {...rest}>
      {children}
    </form>
  )
}

export default Form
