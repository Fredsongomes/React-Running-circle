import type { ComponentProps, ReactNode } from 'react'
import Label from '../Label'
import styles from './FormField.module.css'

type FormFieldProps = ComponentProps<'div'> & {
  label: ReactNode
  htmlFor?: string
}

function FormField({ label, htmlFor, children, ...rest }: FormFieldProps) {
  return (
    <div className={styles.formField} {...rest}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  )
}

export default FormField
