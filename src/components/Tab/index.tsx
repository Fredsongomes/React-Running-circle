import type { ComponentProps } from 'react'
import styles from './Tab.module.css'

type TabProps = ComponentProps<'button'> & {
  active?: boolean
}

function Tab({ children, active = false, type = 'button', ...rest }: TabProps) {
  return (
    <button
      className={`${styles.tab} ${active ? styles.active : ''}`}
      type={type}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Tab
