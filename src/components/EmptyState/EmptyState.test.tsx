import { render, screen } from '@testing-library/react'
import EmptyState from '.'

describe('EmptyState', () => {
  it('exibe title e description default quando as props não são passadas', () => {
    render(<EmptyState />)

    expect(screen.getByText('Nada por aqui ainda...')).toBeInTheDocument()
    expect(
      screen.getByText('Quando houver treinos publicados, eles aparecem aqui.')
    ).toBeInTheDocument()
  })

  it('renderiza title e description de acordo com os valores passados', () => {
    render(
      <EmptyState title="Sem comentários" description="Seja o primeiro a comentar." />
    )

    expect(screen.getByText('Sem comentários')).toBeInTheDocument()
    expect(screen.getByText('Seja o primeiro a comentar.')).toBeInTheDocument()
    expect(screen.queryByText('Nada por aqui ainda...')).not.toBeInTheDocument()
  })
})
