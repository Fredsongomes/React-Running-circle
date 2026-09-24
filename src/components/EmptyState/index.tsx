import type { ComponentProps } from 'react'
import { Footprints } from 'lucide-react'
import Text from '../Text'
import styles from './EmptyState.module.css'

type EmptyStateProps = ComponentProps<'div'> & {
  title?: string
  description?: string
}

function EmptyState({
  title = 'Nada por aqui ainda...',
  description = 'Quando houver treinos publicados, eles aparecem aqui.',
  ...rest
}: EmptyStateProps) {
  return (
    <div className={styles.emptyState} {...rest}>
      <span className={styles.icon}>
        <Footprints size={40} />
      </span>
      <p className={styles.title}>{title}</p>
      <Text>{description}</Text>
    </div>
  )
}

export default EmptyState
