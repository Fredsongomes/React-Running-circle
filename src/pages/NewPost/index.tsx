import { useActionState } from 'react'
import { Flame, Footprints, HeartPulse, Timer } from 'lucide-react'
import Columns from '../../components/Columns'
import FormActions from '../../components/FormActions'
import FormError from '../../components/FormError'
import FormField from '../../components/FormField'
import ImagePlaceholder from '../../components/ImagePlaceholder'
import ImageUploader from '../../components/ImageUploader'
import Input from '../../components/Input'
import Radio from '../../components/Radio'
import RadioGroup from '../../components/RadioGroup'
import Textarea from '../../components/Textarea'
import TimeInput from '../../components/TimeInput'
import Title from '../../components/Title'
import {useNavigate} from "react-router";
import {getErrorMessage} from "../../services/api.ts";
import {createPost, type NewPostPayload} from "../../services/posts.ts";
import {submitWithoutReset} from "../../utils/form.ts";
import styles from './NewPost.module.css'

function NewPost() {

    const navigate = useNavigate()

    const [error, createPostAction, isPending] = useActionState(
        async (_previousError: string | null, formData: FormData) => {
            const hours = Number(formData.get('hours') ?? 0)
            const minutes = Number(formData.get('minutes') ?? 0)
            const distance = Number(formData.get('distance') ?? 0)
            // a API só aceita inteiros para kcal e bpm
            const calories = Math.round(Number(formData.get('calories') ?? 0))
            const heartRateBpm = Math.round(Number(formData.get('heartRate') ?? 0))
            const description = String(formData.get('description') ?? '').trim()
            const type = formData.get('type')
            const image = formData.get('image') as File | null

            const durationSeconds = hours * 3600 + minutes * 60
            const distanceMeters = Math.round(distance * 1000)

            if (!durationSeconds || !distanceMeters || !calories || !heartRateBpm || !description || !type) {
                return 'Preencha todos os campos.'
            }

            const newPost: NewPostPayload = {
                durationSeconds,
                type: type as 'walking' | 'running',
                distanceMeters,
                calories,
                heartRateBpm,
                description,
            }

            if (image && image.size > 0) {
                newPost.image = image
            }

            try {
                await createPost(newPost)
                navigate('/')
                return null
            } catch (err) {
                return getErrorMessage(err, 'Não foi possível criar a postagem.')
            }
        },
        null
    )

  return (
    <>
      <Title>Nova postagem</Title>
      <form onSubmit={submitWithoutReset(createPostAction)}>
        <Columns mediaSize="fluid">
          <ImageUploader
            name="image"
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
              <Input id="distance" name="distance" type="number" min={0} step="0.01" placeholder="5" />
            </FormField>
            <FormField
              label={
                <>
                  <Flame size={20} /> Calorias (Kcal)
                </>
              }
              htmlFor="calories"
            >
              <Input id="calories" name="calories" type="number" min={0} placeholder="300" />
            </FormField>
            <FormField
              label={
                <>
                  <HeartPulse size={20} /> Batimentos (BPM)
                </>
              }
              htmlFor="heart-rate"
            >
              <Input id="heart-rate" name="heartRate" type="number" min={0} placeholder="120" />
            </FormField>
            <FormField label="Descrição" htmlFor="description">
              <Textarea
                id="description"
                name="description"
                placeholder="Conte como foi o seu treino..."
              />
            </FormField>
            <RadioGroup label="Tipo de Treino">
              <Radio name="type" id="walking" value="walking">
                Caminhada
              </Radio>
              <Radio name="type" id="running" value="running">
                Corrida
              </Radio>
            </RadioGroup>
            <FormError>{error}</FormError>
            <FormActions isPending={isPending} />
          </div>
        </Columns>
      </form>
    </>
  )
}

export default NewPost
