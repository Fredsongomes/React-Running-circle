import type { ComponentProps } from 'react'
import logo from '../../assets/images/logo.png'
import styles from './Logo.module.css'

type LogoProps = ComponentProps<'img'>

function Logo({
  src = logo,
  alt = 'Runner Circle',
  ...rest
}: LogoProps) {
  return <img className={styles.logo} src={src} alt={alt} {...rest} />
}

export default Logo
