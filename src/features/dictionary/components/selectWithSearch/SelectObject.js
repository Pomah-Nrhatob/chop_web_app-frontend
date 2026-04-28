import { useGetDictionaryObjects } from '@/features/dictionary/api/use-get-dictionary-objects'

export default function SelectObject() {
  const { data: objects, isLoading } = useGetDictionaryObjects()

  return <div>SelectObject</div>
}
