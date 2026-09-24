import type { ComponentProps, ReactNode } from 'react'
import Text from '../Text'
import styles from './RadioGroup.module.css'

type RadioGroupProps = ComponentProps<'div'> & {
  label: ReactNode
}

function RadioGroup({ label, children, ...rest }: RadioGroupProps) {
  return (
    <div className={styles.radioGroup} {...rest}>
      <Text>{label}</Text>
      {children}
    </div>
  )
}

export default RadioGroup
