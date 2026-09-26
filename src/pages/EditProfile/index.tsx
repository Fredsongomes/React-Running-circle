import Avatar from '../../components/Avatar'
import Columns from '../../components/Columns'
import FormActions from '../../components/FormActions'
import FormError from '../../components/FormError'
import FormField from '../../components/FormField'
import ImageUploader from '../../components/ImageUploader'
import Input from '../../components/Input'
import Text from '../../components/Text'
import Textarea from '../../components/Textarea'
import Title from '../../components/Title'
import {Suspense, use, useActionState, useState} from "react";
import {useNavigate} from "react-router";
import {ErrorBoundary} from "../../components/ErrorBoundary";
import {getErrorMessage} from "../../services/api.ts";
import {fetchLoggedUser, updateUser, type UpdateUser, type User} from "../../services/user.ts";
import {submitWithoutReset} from "../../utils/form.ts";
import styles from './EditProfile.module.css'

type EditProfileFormProps = {
  userPromise: Promise<User>
}

function EditProfileForm({userPromise}: EditProfileFormProps) {
  const loggedUser = use(userPromise)

  const navigate = useNavigate()

  const [error, updateProfileAction, isPending] = useActionState(
    async (_previousError: string | null, formData: FormData) => {
      const name = String(formData.get('name') ?? '').trim()
      const username = String(formData.get('username') ?? '').trim()
      const bio = String(formData.get('bio') ?? '')
      const avatar = formData.get('avatar') as File | null

      if (!name || !username) {
        return 'Preencha todos os campos.'
      }

      const user: UpdateUser = {
        name,
        username,
        bio,
      }

      if (avatar && avatar.size > 0) {
        user.avatar = avatar
      }

      try {
        await updateUser(user)
        navigate('/perfil')
        return null
      } catch (err) {
        return getErrorMessage(err, 'Não foi possível atualizar o perfil.')
      }
    },
    null
  )

  return (
    <form onSubmit={submitWithoutReset(updateProfileAction)}>
      <Columns>
        <ImageUploader
          name="avatar"
          placeholder={
            <Avatar size="large" src={loggedUser.avatarUrl} />
          }
        />
        <div className={styles.fields}>
          <Text bold>@{loggedUser.username}</Text>
          <Title>Edite seus dados</Title>
          <FormField label="Usuário" htmlFor="user">
            <Input id="user" name="username" defaultValue={loggedUser.username} placeholder="julio_corrida" />
          </FormField>
          <FormField label="Nome" htmlFor="name">
            <Input id="name" name="name" defaultValue={loggedUser.name} placeholder="Júlio Oliveira" />
          </FormField>
          <FormField label="Descrição" htmlFor="description">
            <Textarea
              id="description"
              name="bio"
              defaultValue={loggedUser.bio || ""}
            />
          </FormField>
          <FormError>{error}</FormError>
          <FormActions isPending={isPending} />
        </div>
      </Columns>
    </form>
  )
}

function EditProfile() {
  const [userPromise] = useState(() => fetchLoggedUser())

  return (
    <ErrorBoundary fallback={<div>Ocorreu um erro ao carregar os dados do usuário.</div>}>
      <Suspense fallback={<div>Carregando dados do usuário...</div>}>
        <EditProfileForm userPromise={userPromise} />
      </Suspense>
    </ErrorBoundary>
  )
}

export default EditProfile
