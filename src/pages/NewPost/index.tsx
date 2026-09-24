import { Flame, Footprints, HeartPulse, Timer } from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import Columns from '../../components/Columns'
import FormActions from '../../components/FormActions'
import FormField from '../../components/FormField'
import ImagePlaceholder from '../../components/ImagePlaceholder'
import ImageUploader from '../../components/ImageUploader'
import Input from '../../components/Input'
import Radio from '../../components/Radio'
import RadioGroup from '../../components/RadioGroup'
import Textarea from '../../components/Textarea'
import TimeInput from '../../components/TimeInput'
import Title from '../../components/Title'
import styles from './NewPost.module.css'

function NewPost() {
  return (
    <AppLayout>
      <Title>Nova postagem</Title>
      <form>
        <Columns mediaSize="fluid">
          <ImageUploader
            name="image"
            fileName="image_projeto.png"
            placeholder={<ImagePlaceholder />}
          />
          <div className={styles.fields}>
            <FormField
              label={
                <>
                  <Timer size={20} /> Tempo
                </>
              }
              htmlFor="hours"
            >
              <TimeInput />
            </FormField>
            <FormField
              label={
                <>
                  <Footprints size={20} /> Distância (Km)
                </>
              }
              htmlFor="distance"
            >
              <Input id="distance" type="number" min={0} placeholder="5" />
            </FormField>
            <FormField
              label={
                <>
                  <Flame size={20} /> Calorias (Kcal)
                </>
              }
              htmlFor="calories"
            >
              <Input id="calories" type="number" min={0} placeholder="300" />
            </FormField>
            <FormField
              label={
                <>
                  <HeartPulse size={20} /> Batimentos (BPM)
                </>
              }
              htmlFor="heart-rate"
            >
              <Input id="heart-rate" type="number" min={0} placeholder="120" />
            </FormField>
            <FormField label="Descrição" htmlFor="description">
              <Textarea
                id="description"
                placeholder="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium."
              />
            </FormField>
            <RadioGroup label="Tipo de Treino">
              <Radio name="workout-type" id="walking">
                Caminhada
              </Radio>
              <Radio name="workout-type" id="running">
                Corrida
              </Radio>
            </RadioGroup>
            <FormActions />
          </div>
        </Columns>
      </form>
    </AppLayout>
  )
}

export default NewPost
