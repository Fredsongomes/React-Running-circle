import type { ComponentProps } from 'react'
import Button from '../Button'
import styles from './FormActions.module.css'

type FormActionsProps = ComponentProps<'div'>

function FormActions({ ...rest }: FormActionsProps) {
  return (
    <div className={styles.formActions} {...rest}>
      <Button variant="outline">Cancelar</Button>
      <Button>Salvar</Button>
    </div>
  )
}

export default FormActions
