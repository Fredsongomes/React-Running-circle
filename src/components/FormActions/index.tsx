import type { ComponentProps } from 'react'
import { useNavigate } from 'react-router'
import Button from '../Button'
import styles from './FormActions.module.css'

type FormActionsProps = ComponentProps<'div'> & {
  isPending?: boolean
}

function FormActions({ isPending = false, ...rest }: FormActionsProps) {
  const navigate = useNavigate()

  return (
    <div className={styles.formActions} {...rest}>
      <Button variant="outline" onClick={() => navigate(-1)} disabled={isPending}>
        Cancelar
      </Button>
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Salvando...' : 'Salvar'}
      </Button>
    </div>
  )
}

export default FormActions
