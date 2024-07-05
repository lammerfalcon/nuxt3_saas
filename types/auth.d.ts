declare module '#auth-utils' {
  interface User {
    id: number
    email: string
    name: string
    avatar: string
    createdAt: Date
    updatedAt: Date
  }

  interface UserSession {
    id: number
    name: string
    email: string
    avatar: string
    createdAt: Date
  }
}

export {}
