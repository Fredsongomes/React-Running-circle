import type { ComponentProps } from 'react'
import styles from './Logo.module.css'

type LogoProps = ComponentProps<'img'>

function Logo({
  src = '/images/logo.png',
  alt = 'Runner Circle',
  ...rest
}: LogoProps) {
  return <img className={styles.logo} src={src} alt={alt} {...rest} />
}

export default Logo
