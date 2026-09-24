import type { ComponentProps } from 'react'
import styles from './Tag.module.css'

type TagProps = ComponentProps<'span'>

function Tag({ children, ...rest }: TagProps) {
  return (
    <span className={styles.tag} {...rest}>
      {children}
    </span>
  )
}

export default Tag
