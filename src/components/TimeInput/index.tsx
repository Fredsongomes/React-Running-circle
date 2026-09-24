import type { ComponentProps } from 'react'
import Input from '../Input'
import styles from './TimeInput.module.css'

type TimeInputProps = ComponentProps<'div'>

function TimeInput({ ...rest }: TimeInputProps) {
  return (
    <div className={styles.timeInput} {...rest}>
      <div className={styles.field}>
        <Input id="hours" placeholder="00" />
        <span className={styles.caption}>Horas</span>
      </div>
      <span className={styles.separator}>:</span>
      <div className={styles.field}>
        <Input id="minutes" placeholder="30" />
        <span className={styles.caption}>Minutos</span>
      </div>
    </div>
  )
}

export default TimeInput
