export function useUsers() {
  interface IUser {
    id: number
    name: string
    email: string
    avatar: string
    createdAt: Date

  }
  const users = useState<IUser[] | undefined>('users', () => undefined)
  async function fetchUsers() {
    const { data } = await useFetch('/api/users')
    users.value = data.value
  }

  return { users, fetchUsers }
}
