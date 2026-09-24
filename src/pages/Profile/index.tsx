import AppLayout from '../../components/AppLayout'
import PostCard from '../../components/PostCard'
import PostsGrid from '../../components/PostsGrid'
import ProfileHeader from '../../components/ProfileHeader'
import Tab from '../../components/Tab'
import Tabs from '../../components/Tabs'

const posts = [1, 2, 3, 4, 5, 6]

function Profile() {
  return (
    <AppLayout>
      <ProfileHeader
        avatarSrc="https://i.pravatar.cc/300?img=59"
        username="@julio"
        name="Júlio Oliveira"
        bio="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
        workouts={3}
      />
      <Tabs>
        <Tab active>Posts</Tab>
        <Tab>Curtidas</Tab>
      </Tabs>
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
    </AppLayout>
  )
}

export default Profile
