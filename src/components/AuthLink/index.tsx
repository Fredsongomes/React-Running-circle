import type { ComponentProps, ReactNode } from 'react'
import { LogIn } from 'lucide-react'
import styles from './AuthLink.module.css'

type AuthLinkProps = ComponentProps<'a'> & {
  linkText: string
  icon?: ReactNode
}

function AuthLink({
  children,
  linkText,
  icon = <LogIn size={20} />,
  href = '#',
  ...rest
}: AuthLinkProps) {
  return (
    <p className={styles.authLink}>
      {children}
      <a className={styles.link} href={href} {...rest}>
        {linkText}
        {icon}
      </a>
    </p>
  )
}

export default AuthLink
