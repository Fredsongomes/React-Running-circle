import type { ChangeEvent, ComponentProps, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import Button from '../Button'
import FileItem from '../FileItem'
import styles from './ImageUploader.module.css'

type ImageUploaderProps = ComponentProps<'div'> & {
  name?: string
  placeholder?: ReactNode
}

interface Selected {
  file: File
  previewUrl: string
}

function ImageUploader({
  name,
  placeholder,
  ...rest
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useState<Selected | null>(null)

  // Libera a URL do preview quando a imagem muda ou o componente sai da tela
  useEffect(() => {
    if (!selected) return
    return () => URL.revokeObjectURL(selected.previewUrl)
  }, [selected])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    // cancelar a janela de seleção também limpa o input
    setSelected(file ? { file, previewUrl: URL.createObjectURL(file) } : null)
  }

  const handleRemove = () => {
    setSelected(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className={styles.imageUploader} {...rest}>
      {selected ? (
        <img
          src={selected.previewUrl}
          alt="Pré-visualização da imagem selecionada"
          className={styles.preview}
        />
      ) : (
        placeholder
      )}
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/png, image/jpeg, image/webp"
        hidden
        onChange={handleChange}
      />
      <Button
        variant="outline"
        type="button"
        icon={<Upload size={20} />}
        onClick={() => inputRef.current?.click()}
      >
        Carregar imagem
      </Button>
      {selected && <FileItem onRemove={handleRemove}>{selected.file.name}</FileItem>}
    </div>
  )
}

export default ImageUploader
