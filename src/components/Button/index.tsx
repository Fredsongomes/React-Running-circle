import type { ComponentProps, ReactNode } from 'react'
import styles from './Button.module.css'

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'outline'
  icon?: ReactNode
}

function Button({
  children,
  icon,
  variant = 'primary',
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      type={type}
      {...rest}
    >
      {children}
      {icon}
    </button>
  )
}

export default Button
