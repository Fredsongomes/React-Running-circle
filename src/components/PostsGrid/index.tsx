import type { ComponentProps } from 'react'
import styles from './PostsGrid.module.css'

type PostsGridProps = ComponentProps<'section'>

function PostsGrid({ children, ...rest }: PostsGridProps) {
  return (
    <section className={styles.postsGrid} {...rest}>
      {children}
    </section>
  )
}

export default PostsGrid
