import type { ComponentProps } from 'react'
import styles from './FormError.module.css'

type FormErrorProps = ComponentProps<'p'>

function FormError({ children, ...rest }: FormErrorProps) {
  if (!children) return null

  return (
    <p role="alert" className={styles.error} {...rest}>
      {children}
    </p>
  )
}

export default FormError
