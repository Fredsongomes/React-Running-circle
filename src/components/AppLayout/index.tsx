import type { ComponentProps } from 'react'
import Sidebar from '../Sidebar'
import styles from './AppLayout.module.css'

type AppLayoutProps = ComponentProps<'main'>

function AppLayout({ children, ...rest }: AppLayoutProps) {
  return (
    <div className={styles.appLayout}>
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.main} {...rest}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout
