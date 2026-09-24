import type { ComponentProps } from 'react'
import styles from './Text.module.css'

type TextProps = ComponentProps<'p'> & {
  bold?: boolean
}

function Text({ children, bold = false, ...rest }: TextProps) {
  return (
    <p className={`${styles.text} ${bold ? styles.bold : ''}`} {...rest}>
      {children}
    </p>
  )
}

export default Text
