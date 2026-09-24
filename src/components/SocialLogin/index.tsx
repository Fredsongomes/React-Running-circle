import type { ComponentProps, ReactNode } from 'react'
import styles from './SocialLogin.module.css'

type SocialLoginProps = ComponentProps<'a'> & {
  icon: ReactNode
}

function SocialLogin({ children, icon, href = '#', ...rest }: SocialLoginProps) {
  return (
    <a className={styles.socialLogin} href={href} {...rest}>
      {icon}
      {children}
    </a>
  )
}

export default SocialLogin
