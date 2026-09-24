import { Send } from 'lucide-react'
import Button from '../Button'
import Comment from '../Comment'
import Input from '../Input'
import Modal from '../Modal'
import styles from './CommentsModal.module.css'

type CommentsModalProps = {
  open?: boolean
  onClose?: () => void
}

const comments = [
  {
    author: 'Júlia Santos',
    text: 'Arrasou! 👏',
    avatarSrc: 'https://i.pravatar.cc/96?img=45',
  },
  {
    author: 'Pedro Lima',
    text: 'Bora treinar junto semana que vem?',
    avatarSrc: 'https://i.pravatar.cc/96?img=12',
  },
  {
    author: 'Marina Costa',
    text: 'Que ritmo! Tô inspirada 🔥',
    avatarSrc: 'https://i.pravatar.cc/96?img=32',
  },
  {
    author: 'Rafael Souza',
    text: 'Top demais, parabéns pela evolução!',
    avatarSrc: 'https://i.pravatar.cc/96?img=59',
  },
]

function CommentsModal({ open, onClose }: CommentsModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Comentários">
      <ul className={styles.list}>
        {comments.map((comment) => (
          <Comment
            key={comment.author}
            avatarSrc={comment.avatarSrc}
            author={comment.author}
            text={comment.text}
          />
        ))}
      </ul>
      <form className={styles.composer}>
        <Input placeholder="Escreva um comentário..." />
        <Button icon={<Send size={20} />} aria-label="Enviar comentário" />
      </form>
    </Modal>
  )
}

export default CommentsModal
