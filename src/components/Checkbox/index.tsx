import type { ComponentProps } from 'react'
import { Check } from 'lucide-react'
import styles from './Checkbox.module.css'

type CheckboxProps = ComponentProps<'input'>

function Checkbox({ children, id, ...rest }: CheckboxProps) {
  return (
    <label className={styles.checkbox} htmlFor={id}>
      <input className={styles.input} type="checkbox" id={id} {...rest} />
      <span className={styles.box}>
        <Check size={14} strokeWidth={3} />
      </span>
      {children}
    </label>
  )
}

export default Checkbox
