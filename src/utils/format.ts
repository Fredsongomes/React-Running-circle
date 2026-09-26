import type { Post } from '../services/posts'

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  const paddedHours = String(hours).padStart(2, '0')
  const paddedMinutes = String(minutes).padStart(2, '0')

  return `${paddedHours}:${paddedMinutes}`
}

/** 4200 → "4,2 Km" (a API guarda metros; a exibição é em km, padrão pt-BR). */
export function formatDistance(meters: number): string {
  const km = (meters / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })
  return `${km} Km`
}

const WORKOUT_LABELS: Record<Post['type'], string> = {
  walking: 'Caminhada',
  running: 'Corrida',
}

export function formatWorkoutType(type: Post['type']): string {
  return WORKOUT_LABELS[type]
}
