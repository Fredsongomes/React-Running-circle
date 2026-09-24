import type { ComponentProps } from 'react'
import Logo from '../Logo'
import styles from './AuthLayout.module.css'

type AuthLayoutProps = ComponentProps<'main'> & {
  bannerImage: string
}

function AuthLayout({ children, bannerImage, ...rest }: AuthLayoutProps) {
  return (
    <main className={styles.page} {...rest}>
      <section className={styles.card}>
        <div className={styles.formArea}>{children}</div>
        <div className={styles.banner}>
          <Logo />
          <img className={styles.bannerImage} src={bannerImage} alt="" />
        </div>
      </section>
    </main>
  )
}

export default AuthLayout
