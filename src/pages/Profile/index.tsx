import ProfileHeader from '../../components/ProfileHeader'
import Tab from '../../components/Tab'
import Tabs from '../../components/Tabs'
import EmptyState from '../../components/EmptyState'
import {Suspense, use, useState} from "react";
import {fetchLoggedUser, type User} from "../../services/user.ts";
import {ErrorBoundary} from "../../components/ErrorBoundary";
import PostList from "../../components/PostList";
import {fetchPostsCreatedByTheLoggedUser, fetchPostsLikedByTheLoggedUser} from "../../services/posts.ts";

type ProfileTab = 'posts' | 'likes'

type ProfileInfoProps = {
    userPromise: Promise<User>
}

function ProfileInfo({userPromise}: ProfileInfoProps) {
    const loggedUser = use(userPromise)

    return (
      <ProfileHeader
        avatarSrc={loggedUser.avatarUrl}
        username={loggedUser.username}
        name={loggedUser.name}
        bio={loggedUser.bio || ""}
        workouts={loggedUser.workoutsCount}
      />
    )
}

function Profile() {
    const [userPromise] = useState(() => fetchLoggedUser())

    const [activeTab, setActiveTab] = useState<ProfileTab>('posts')
    const [postPromise, setPostPromise] = useState(() => fetchPostsCreatedByTheLoggedUser())

    function handleTabChange(tab: ProfileTab) {
        setActiveTab(tab)
        setPostPromise(
            tab === 'posts' ? fetchPostsCreatedByTheLoggedUser() : fetchPostsLikedByTheLoggedUser()
        )
    }

    return (
    <>
      <ErrorBoundary fallback={<div>Ocorreu um erro ao carregar os dados do usuário.</div>}>
        <Suspense fallback={<div>Carregando dados do usuário...</div>}>
          <ProfileInfo userPromise={userPromise} />
        </Suspense>
      </ErrorBoundary>
      <Tabs>
        <Tab active={activeTab === 'posts'} onClick={() => handleTabChange('posts')}>Posts</Tab>
        <Tab active={activeTab === 'likes'} onClick={() => handleTabChange('likes')}>Curtidas</Tab>
      </Tabs>
      <ErrorBoundary fallback={<div>Ocorreu um erro ao carregar os posts.</div>}>
        <Suspense fallback={<div>Carregando posts...</div>}>
          <PostList
            key={activeTab}
            postPromise={postPromise}
            emptyState={
              activeTab === 'likes' ? (
                <EmptyState
                  title="Nenhuma curtida ainda"
                  description="Quando você curtir um treino, ele aparece aqui."
                />
              ) : (
                <EmptyState
                  title="Nenhum treino publicado"
                  description="Publique seu primeiro treino e ele aparece aqui."
                />
              )
            }
          />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

export default Profile
