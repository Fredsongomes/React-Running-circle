import type { ReactNode } from 'react'
import { NavLink, type NavLinkProps } from 'react-router'
import styles from './NavItem.module.css'

type NavItemProps = Omit<NavLinkProps, 'children' | 'className'> & {
  children?: ReactNode
  icon: ReactNode
}

function NavItem({ children, icon, ...rest }: NavItemProps) {
  return (
    <NavLink className={styles.navItem} {...rest}>
      {icon}
      {children}
    </NavLink>
  )
}

export default NavItem
