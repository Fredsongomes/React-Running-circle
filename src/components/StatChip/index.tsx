import type { ComponentProps, ReactNode } from 'react'
import styles from './StatChip.module.css'

type StatChipProps = ComponentProps<'div'> & {
  icon: ReactNode
  label: string
  value: string
}

function StatChip({ icon, label, value, ...rest }: StatChipProps) {
  return (
    <div className={styles.statChip} {...rest}>
      {icon}
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

export default StatChip
