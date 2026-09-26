import type { ComponentProps } from 'react'
import { Trash2 } from 'lucide-react'
import Avatar from '../Avatar'
import Text from '../Text'
import styles from './Comment.module.css'

type CommentProps = ComponentProps<'li'> & {
  avatarSrc?: string
  author: string
  text: string
  onDelete?: () => void
}

function Comment({ avatarSrc, author, text, onDelete, ...rest }: CommentProps) {
  return (
    <li className={styles.comment} {...rest}>
      <Avatar src={avatarSrc} />
      <div className={styles.content}>
        <Text bold>{author}</Text>
        <Text>{text}</Text>
      </div>
      {onDelete && (
        <button
          type="button"
          className={styles.delete}
          aria-label="Excluir comentário"
          onClick={onDelete}>
          <Trash2 size={18} />
        </button>
      )}
    </li>
  )
}

export default Comment
