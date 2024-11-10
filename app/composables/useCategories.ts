export function useCategories() {
  interface ICategory {
    id: number
    name: string
    createdAt: Date

  }
  const categories = useState<ICategory[] | undefined>('categories', () => undefined)
  function createCategory(name: string) {
    console.log('here', name)
    return $fetch('/api/categories', { body: { name }, method: 'POST' })
  }
  async function fetchCategories() {
    const { data } = await useFetch('/api/categories')
    categories.value = data.value
  }

  return { categories, fetchCategories, createCategory }
}
