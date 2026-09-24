import type { ComponentProps } from 'react'
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
import styles from './PostCard.module.css'

type PostCardProps = ComponentProps<'article'> & {
  imageUrl?: string | null
  time: string
  activity: string
  distance: string
  calories: string
  heartRate: string
  author: string
  avatarSrc: string | null
  likes: string | number
  comments: string | number
  description: string
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
  likes,
  comments,
  description,
  ...rest
}: PostCardProps) {
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
          <button type="button" className={styles.reaction}>
            <ThumbsUp size={20} />
            {likes}
          </button>
          <button type="button" className={styles.reaction}>
            <MessageSquare size={20} />
            {comments}
          </button>
        </div>
        <Text>{description}</Text>
      </footer>
    </article>
  )
}

export default PostCard
