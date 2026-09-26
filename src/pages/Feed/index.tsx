import SearchInput from '../../components/SearchInput'
import {ErrorBoundary} from "../../components/ErrorBoundary";
import {Suspense, useState} from "react";
import PostList from "../../components/PostList";
import {fetchPosts} from "../../services/posts.ts";

function Feed() {

    const [postPromise] = useState(() => fetchPosts())
    const [search, setSearch] = useState('')

  return (
    <>
      <SearchInput
        placeholder="O que você procura?"
        aria-label="Buscar treinos"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
        <ErrorBoundary fallback={<div>Ocorreu um erro ao carregar os posts.</div>}>
            <Suspense fallback={<div>Carregando posts...</div>}>
                <PostList postPromise={postPromise} search={search} />
            </Suspense>
        </ErrorBoundary>
    </>
  )
}
export default Feed
