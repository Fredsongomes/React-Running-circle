import type { ComponentProps } from 'react'
import styles from './Title.module.css'

type TitleProps = ComponentProps<'h1'>

function Title({ children, ...rest }: TitleProps) {
  return (
    <h1 className={styles.title} {...rest}>
      {children}
    </h1>
  )
}

export default Title
