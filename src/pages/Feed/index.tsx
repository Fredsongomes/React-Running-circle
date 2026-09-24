
import PostCard from '../../components/PostCard'
import PostsGrid from '../../components/PostsGrid'
import SearchInput from '../../components/SearchInput'

const posts = [1, 2, 3, 4, 5, 6]

function Feed() {
  return (
    <>
      <SearchInput placeholder="O que você procura?" />
      <PostsGrid>
        {posts.map((post) => (
          <PostCard
            key={post}
            time="00:30"
            activity="Caminhada intensa"
            distance="2 Km"
            calories="300 Kcal"
            heartRate="120 BPM"
            author="Laura Mota Linhares"
            avatarSrc="https://i.pravatar.cc/96?img=68"
            likes={5}
            comments={2}
            description="Hoje dei meu mínimo e esse foi meu máximo! kkkk"
          />
        ))}
      </PostsGrid>
    </>
  )
}

export default Feed
