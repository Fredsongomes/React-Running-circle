import {type ReactNode, use} from 'react'
import EmptyState from '../EmptyState'
import PostCard from '../PostCard'
import PostsGrid from '../PostsGrid'
import {type Post} from '../../services/posts.ts'
import {formatDistance, formatDuration, formatWorkoutType} from '../../utils/format'

type PostListProps = {
    postPromise: Promise<Post[]>
    emptyState?: ReactNode
    search?: string
}

function matchesSearch(post: Post, term: string): boolean {
    const haystack = [
        post.description,
        post.author.name,
        post.author.username,
        formatWorkoutType(post.type),
    ].join(' ').toLowerCase()

    return haystack.includes(term)
}

function PostList({postPromise, emptyState = <EmptyState/>, search = ''}: PostListProps) {

    const term = search.trim().toLowerCase()
    const posts = use(postPromise).filter((post) => !term || matchesSearch(post, term))

    if (posts.length === 0) {
        return term
            ? <EmptyState title="Nenhum resultado" description={`Nenhum treino encontrado para "${search.trim()}".`}/>
            : emptyState
    }

    return (
            <PostsGrid>
                {posts.map((post) => (
                    <PostCard
                        key={post.id}
                        time={formatDuration(post.durationSeconds)}
                        activity={formatWorkoutType(post.type)}
                        distance={formatDistance(post.distanceMeters)}
                        calories={`${post.calories} Kcal`}
                        heartRate={`${post.heartRateBpm} BPM`}
                        author={post.author.name}
                        avatarSrc={post.author.avatarUrl ?? undefined}
                        likes={post.likesCount}
                        comments={post.commentsCount}
                        description={post.description}
                        imageUrl={post.imageUrl}
                        liked={post.likedByMe}
                        postId={post.id}
                    />
                ))}
            </PostsGrid>
    )
}

export default PostList
