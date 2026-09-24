import AppLayout from '../../components/AppLayout'
import Avatar from '../../components/Avatar'
import Columns from '../../components/Columns'
import FormActions from '../../components/FormActions'
import FormField from '../../components/FormField'
import ImageUploader from '../../components/ImageUploader'
import Input from '../../components/Input'
import Text from '../../components/Text'
import Textarea from '../../components/Textarea'
import Title from '../../components/Title'
import styles from './EditProfile.module.css'

function EditProfile() {
  return (
    <AppLayout>
      <form>
        <Columns>
          <ImageUploader
            fileName="image.png"
            placeholder={
              <Avatar size="large" src="https://i.pravatar.cc/300?img=59" />
            }
          />
          <div className={styles.fields}>
            <Text bold>@julio</Text>
            <Title>Edite seus dados</Title>
            <FormField label="User" htmlFor="user">
              <Input id="user" placeholder="@julio_corrida" />
            </FormField>
            <FormField label="Nome" htmlFor="name">
              <Input id="name" placeholder="Júlio Oliveira" />
            </FormField>
            <FormField label="Descrição" htmlFor="description">
              <Textarea
                id="description"
                placeholder="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium."
              />
            </FormField>
            <FormActions />
          </div>
        </Columns>
      </form>
    </AppLayout>
  )
}

export default EditProfile
