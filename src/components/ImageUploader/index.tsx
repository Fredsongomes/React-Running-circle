import type { ComponentProps, ReactNode } from 'react'
import { useRef } from 'react'
import { Upload } from 'lucide-react'
import Button from '../Button'
import FileItem from '../FileItem'
import styles from './ImageUploader.module.css'

type ImageUploaderProps = ComponentProps<'div'> & {
  name?: string
  fileName?: string
  placeholder?: ReactNode
}

function ImageUploader({
  name,
  fileName,
  placeholder,
  ...rest
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className={styles.imageUploader} {...rest}>
      {placeholder}
      <input ref={inputRef} type="file" name={name} accept="image/*" hidden />
      <Button
        variant="outline"
        type="button"
        icon={<Upload size={20} />}
        onClick={() => inputRef.current?.click()}
      >
        Carregar imagem
      </Button>
      {fileName && <FileItem>{fileName}</FileItem>}
    </div>
  )
}

export default ImageUploader
