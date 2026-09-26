import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PostCard from '.'
import { likePost, unlikePost } from '../../services/posts'

vi.mock('../../services/posts', () => ({
  likePost: vi.fn(),
  unlikePost: vi.fn(),
}))

const defaultProps = {
  postId: '1',
  author: 'Fredson Gomes',
  activity: 'Corrida',
  time: '00:15',
  distance: '5 Km',
  calories: '330 Kcal',
  heartRate: '130 BPM',
  description: 'Uma corrida bacana',
  likes: 5,
  comments: 2,
  liked: false,
}

describe('PostCard', () => {
  it('mostra os dados do treino', () => {
    render(<PostCard {...defaultProps} />)

    expect(screen.getByText('Fredson Gomes')).toBeInTheDocument()
    expect(screen.getByText('Corrida')).toBeInTheDocument()
    expect(screen.getByText('5 Km')).toBeInTheDocument()
    expect(screen.getByText('Uma corrida bacana')).toBeInTheDocument()
  })

  it('curte o post e atualiza a contagem com o valor da API', async () => {
    vi.mocked(likePost).mockResolvedValue({ postId: '1', likesCount: 6, likedByMe: true })
    render(<PostCard {...defaultProps} />)

    await userEvent.click(screen.getByRole('button', { name: 'Curtir' }))

    expect(likePost).toHaveBeenCalledWith('1')
    expect(await screen.findByRole('button', { name: 'Descurtir' })).toHaveTextContent('6')
  })

  it('descurte quando o post já estava curtido', async () => {
    vi.mocked(unlikePost).mockResolvedValue({ postId: '1', likesCount: 4, likedByMe: false })
    render(<PostCard {...defaultProps} liked />)

    await userEvent.click(screen.getByRole('button', { name: 'Descurtir' }))

    expect(unlikePost).toHaveBeenCalledWith('1')
    expect(await screen.findByRole('button', { name: 'Curtir' })).toHaveTextContent('4')
  })
})
