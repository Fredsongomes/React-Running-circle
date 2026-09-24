import type { ComponentProps } from 'react'
import Avatar from '../Avatar'
import Text from '../Text'
import styles from './Comment.module.css'

type CommentProps = ComponentProps<'li'> & {
  avatarSrc: string
  author: string
  text: string
}

function Comment({ avatarSrc, author, text, ...rest }: CommentProps) {
  return (
    <li className={styles.comment} {...rest}>
      <Avatar src={avatarSrc} />
      <div className={styles.content}>
        <Text bold>{author}</Text>
        <Text>{text}</Text>
      </div>
    </li>
  )
}

export default Comment
