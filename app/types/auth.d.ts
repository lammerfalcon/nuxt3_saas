declare module '#auth-utils' {
  interface User {
    id: number
    email: string
    name: string
    avatar: string
    createdAt: Date
  }

  interface UserSession {
    user: User
  }
}

export { UserSession, User }
