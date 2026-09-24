import type { ComponentProps } from 'react'
import { CircleUserRound } from 'lucide-react'
import styles from './Avatar.module.css'

type AvatarProps = Omit<ComponentProps<'img'>, 'src'> & {
  size?: 'small' | 'large'
  src?: string | null
}

function Avatar({ size = 'small', src, alt = '', ...rest }: AvatarProps) {
  if (!src) {
    return (
      <span className={`${styles.avatar} ${styles.fallback} ${styles[size]}`}>
        <CircleUserRound />
      </span>
    )
  }

  return (
    <img
      className={`${styles.avatar} ${styles[size]}`}
      src={src}
      alt={alt}
      {...rest}
    />
  )
}

export default Avatar
