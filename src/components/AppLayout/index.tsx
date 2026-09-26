import { Suspense, type ComponentProps } from 'react'
import Sidebar from '../Sidebar'
import Text from '../Text'
import styles from './AppLayout.module.css'
import {Outlet} from "react-router";

type AppLayoutProps = ComponentProps<'main'>

function AppLayout(props: AppLayoutProps) {
  return (
    <div className={styles.appLayout}>
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.main} {...props}>
          <Suspense fallback={<Text>Carregando...</Text>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default AppLayout
