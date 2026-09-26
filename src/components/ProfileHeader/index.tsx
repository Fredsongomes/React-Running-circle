import type { ComponentProps } from 'react'
import { Pencil } from 'lucide-react'
import Avatar from '../Avatar'
import Text from '../Text'
import styles from './ProfileHeader.module.css'
import {NavLink} from "react-router";

type ProfileHeaderProps = ComponentProps<'header'> & {
  avatarSrc?: string | null
  username: string
  name: string
  bio: string
  workouts: number
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
        <Text bold>@{username}</Text>
        <p className={styles.name}>{name}</p>
        <Text>{bio}</Text>
        <p className={styles.stats}>
          <strong>{workouts}</strong> {workouts === 1 ? 'Treino' : 'Treinos'}
        </p>
      </div>
      <NavLink className={styles.edit} to="/perfil/editar">
        <Pencil size={20} />
        Editar
      </NavLink>
    </header>
  )
}

export default ProfileHeader
