import {type ComponentProps, useState} from 'react'
import {
  Flame,
  Footprints,
  HeartPulse,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react'
import Avatar from '../Avatar'
import ImagePlaceholder from '../ImagePlaceholder'
import StatChip from '../StatChip'
import Tag from '../Tag'
import Text from '../Text'
import CommentsModal from '../CommentsModal'
import {likePost, unlikePost} from '../../services/posts.ts'
import styles from './PostCard.module.css'

type PostCardProps = ComponentProps<'article'> & {
  imageUrl?: string | null
  time: string
  activity: string
  distance: string
  calories: string
  heartRate: string
  author: string
  avatarSrc?: string | null
  likes: number
  comments: number
  description: string
  liked: boolean
  postId: string
}

function PostCard({
  imageUrl,
  time,
  activity,
  distance,
  calories,
  heartRate,
  author,
  avatarSrc,
  likes: likesInitial,
  comments: commentsCountInitial,
  description,
  liked: likedInitial,
  postId,
  ...rest
}: PostCardProps) {

  const [likes, setLikes] = useState(likesInitial)
  const [liked, setLiked] = useState(likedInitial)
  const [commentsCount, setCommentsCount] = useState(commentsCountInitial)
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  async function handleLike() {
    // evita requisições concorrentes em cliques repetidos
    if (isLiking) return
    setIsLiking(true)
    try {
      const likeState = liked ? await unlikePost(postId) : await likePost(postId)
      setLikes(likeState.likesCount)
      setLiked(likeState.likedByMe)
    } catch {
      console.error('Não foi possível atualizar a curtida.')
    } finally {
      setIsLiking(false)
    }
  }

  function handleCommentCreated() {
    setCommentsCount((previousCount) => previousCount + 1)
  }

  function handleCommentDeleted() {
    setCommentsCount((previousCount) => previousCount - 1)
  }

  return (
    <article className={styles.postCard} {...rest}>
      {imageUrl ? (
        <img className={styles.image} src={imageUrl} alt="" />
      ) : (
        <ImagePlaceholder />
      )}
      <div className={styles.content}>
        <p className={styles.timeLabel}>Tempo:</p>
        <p className={styles.time}>{time}</p>
        <Tag>{activity}</Tag>
        <div className={styles.stats}>
          <StatChip
            icon={<Footprints size={16} />}
            label="Distância"
            value={distance}
          />
          <StatChip
            icon={<Flame size={16} />}
            label="Calorias"
            value={calories}
          />
          <StatChip
            icon={<HeartPulse size={16} />}
            label="Batimentos"
            value={heartRate}
          />
        </div>
        <div className={styles.author}>
          <Avatar src={avatarSrc} />
          <Text>{author}</Text>
        </div>
      </div>
      <footer className={styles.footer}>
        <div className={styles.reactions}>
          <button
              type="button"
              className={liked ? `${styles.reaction} ${styles.liked}` : styles.reaction}
              aria-label={liked ? 'Descurtir' : 'Curtir'}
              aria-pressed={liked}
              disabled={isLiking}
              onClick={handleLike}>
            <ThumbsUp size={20} />
            {likes}
          </button>
          <button
              type="button"
              className={styles.reaction}
              aria-label="Ver comentários"
              onClick={() => setIsCommentsOpen(true)}>
            <MessageSquare size={20} />
            {commentsCount}
          </button>
        </div>
        <Text>{description}</Text>
      </footer>
      {isCommentsOpen && (
        <CommentsModal
          postId={postId}
          onClose={() => setIsCommentsOpen(false)}
          onCommentCreated={handleCommentCreated}
          onCommentDeleted={handleCommentDeleted}
        />
      )}
    </article>
  )
}

export default PostCard
