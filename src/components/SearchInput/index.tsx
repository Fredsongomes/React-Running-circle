import type { ComponentProps } from 'react'
import { Search } from 'lucide-react'
import styles from './SearchInput.module.css'

type SearchInputProps = ComponentProps<'input'>

function SearchInput({ ...rest }: SearchInputProps) {
  return (
    <div className={styles.searchInput}>
      <Search size={20} />
      <input className={styles.input} type="search" {...rest} />
    </div>
  )
}

export default SearchInput
