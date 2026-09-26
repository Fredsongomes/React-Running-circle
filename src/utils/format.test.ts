import { formatDistance, formatDuration, formatWorkoutType } from './format'

describe('format', () => {
  it('formata duração em HH:MM', () => {
    expect(formatDuration(1800)).toBe('00:30')
    expect(formatDuration(3660)).toBe('01:01')
  })

  it('formata distância em km no padrão pt-BR', () => {
    expect(formatDistance(5000)).toBe('5 Km')
    expect(formatDistance(4200)).toBe('4,2 Km')
    expect(formatDistance(1234)).toBe('1,23 Km')
  })

  it('traduz o tipo de treino', () => {
    expect(formatWorkoutType('running')).toBe('Corrida')
    expect(formatWorkoutType('walking')).toBe('Caminhada')
  })
})
