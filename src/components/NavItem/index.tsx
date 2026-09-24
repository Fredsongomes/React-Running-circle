import type { ComponentProps, ReactNode } from 'react'
import styles from './NavItem.module.css'

type NavItemProps = ComponentProps<'a'> & {
  icon: ReactNode
}

function NavItem({ children, icon, href = '#', ...rest }: NavItemProps) {
  return (
    <a className={styles.navItem} href={href} {...rest}>
      {icon}
      {children}
    </a>
  )
}

export default NavItem
