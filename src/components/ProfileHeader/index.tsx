import type { ComponentProps } from 'react'
import { Pencil } from 'lucide-react'
import Avatar from '../Avatar'
import Text from '../Text'
import styles from './ProfileHeader.module.css'

type ProfileHeaderProps = ComponentProps<'header'> & {
  avatarSrc: string
  username: string
  name: string
  bio: string
  workouts: string | number
}

function ProfileHeader({
  avatarSrc,
  username,
  name,
  bio,
  workouts,
  ...rest
}: ProfileHeaderProps) {
  return (
    <header className={styles.profileHeader} {...rest}>
      <Avatar size="large" src={avatarSrc} />
      <div className={styles.info}>
        <Text bold>{username}</Text>
        <p className={styles.name}>{name}</p>
        <Text>{bio}</Text>
        <p className={styles.stats}>
          <strong>{workouts}</strong> Treinos
        </p>
      </div>
      <a className={styles.edit} href="#">
        <Pencil size={20} />
        Editar
      </a>
    </header>
  )
}

export default ProfileHeader
