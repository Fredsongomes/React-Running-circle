import type { ReactNode } from 'react'
import { NavLink, type NavLinkProps } from 'react-router'
import { LogIn } from 'lucide-react'
import styles from './AuthLink.module.css'

type AuthLinkProps = Omit<NavLinkProps, 'children' | 'className'> & {
  children?: ReactNode
  linkText: string
  icon?: ReactNode
}

function AuthLink({
  children,
  linkText,
  icon = <LogIn size={20} />,
  ...rest
}: AuthLinkProps) {
  return (
    <p className={styles.authLink}>
      {children}
      <NavLink className={styles.link} end {...rest}>
        {linkText}
        {icon}
      </NavLink>
    </p>
  )
}

export default AuthLink
