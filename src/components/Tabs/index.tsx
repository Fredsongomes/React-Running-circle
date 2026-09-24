import type { ComponentProps } from 'react'
import styles from './Tabs.module.css'

type TabsProps = ComponentProps<'nav'>

function Tabs({ children, ...rest }: TabsProps) {
  return (
    <nav className={styles.tabs} {...rest}>
      {children}
    </nav>
  )
}

export default Tabs
