import { Suspense, use, useActionState, useState } from 'react'
import { Send } from 'lucide-react'
import Button from '../Button'
import Comment from '../Comment'
import EmptyState from '../EmptyState'
import { ErrorBoundary } from '../ErrorBoundary'
import Input from '../Input'
import Modal from '../Modal'
import Text from '../Text'
import {
  createComment,
  deleteComment,
  getComments,
  type Comment as PostComment,
} from '../../services/comments.ts'
import { fetchLoggedUser, type User } from '../../services/user.ts'
import styles from './CommentsModal.module.css'

type CommentsModalProps = {
  postId: string
  onClose?: () => void
  onCommentCreated?: () => void
  onCommentDeleted?: () => void
}

type CommentListProps = {
  commentsPromise: Promise<PostComment[]>
  loggedUserPromise: Promise<User>
  newComments: PostComment[]
  deletedCommentIds: string[]
  onDeleteComment: (commentId: string) => void
}

function CommentList({
  commentsPromise,
  loggedUserPromise,
  newComments,
  deletedCommentIds,
  onDeleteComment,
}: CommentListProps) {
  const loggedUser = use(loggedUserPromise)
  const comments = [...use(commentsPromise), ...newComments].filter(
    (comment) => !deletedCommentIds.includes(comment.id)
  )

  if (comments.length === 0) {
    return (
      <EmptyState
        title="Nenhum comentário ainda"
        description="Seja o primeiro a comentar neste treino."
      />
    )
  }

  return (
    <ul className={styles.list}>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          avatarSrc={comment.author.avatarUrl ?? undefined}
          author={comment.author.name}
          text={comment.text}
          onDelete={
            comment.author.id === loggedUser.id
              ? () => onDeleteComment(comment.id)
              : undefined
          }
        />
      ))}
    </ul>
  )
}

function CommentsModal({
  postId,
  onClose,
  onCommentCreated,
  onCommentDeleted,
}: CommentsModalProps) {
  const [commentsPromise] = useState(() => getComments(postId))
  const [loggedUserPromise] = useState(() => fetchLoggedUser())
  const [newComments, setNewComments] = useState<PostComment[]>([])
  const [deletedCommentIds, setDeletedCommentIds] = useState<string[]>([])

  const [error, createCommentAction, isPending] = useActionState(
    async (_previousError: string | null, formData: FormData) => {
      const text = String(formData.get('text') ?? '').trim()

      if (!text) {
        return 'Escreva um comentário.'
      }

      try {
        const comment = await createComment(postId, text)
        setNewComments((previousComments) => [...previousComments, comment])
        onCommentCreated?.()
        return null
      } catch {
        return 'Não foi possível enviar o comentário.'
      }
    },
    null
  )

  async function handleDeleteComment(commentId: string) {
    try {
      await deleteComment(postId, commentId)
      setDeletedCommentIds((previousIds) => [...previousIds, commentId])
      onCommentDeleted?.()
    } catch {
      console.error('Não foi possível excluir o comentário.')
    }
  }

  return (
    <Modal open onClose={onClose} title="Comentários">
      <ErrorBoundary fallback={<Text>Ocorreu um erro ao carregar os comentários.</Text>}>
        <Suspense fallback={<Text>Carregando comentários...</Text>}>
          <CommentList
            commentsPromise={commentsPromise}
            loggedUserPromise={loggedUserPromise}
            newComments={newComments}
            deletedCommentIds={deletedCommentIds}
            onDeleteComment={handleDeleteComment}
          />
        </Suspense>
      </ErrorBoundary>
      <form className={styles.composer} action={createCommentAction}>
        <Input name="text" placeholder="Escreva um comentário..." />
        <Button
          type="submit"
          icon={<Send size={20} />}
          aria-label="Enviar comentário"
          disabled={isPending}
        />
      </form>
      {error && <Text role="alert">{error}</Text>}
    </Modal>
  )
}

export default CommentsModal
