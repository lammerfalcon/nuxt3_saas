declare module '#auth-utils' {
  interface User {
    email: string
    name: string
    avatar: string
    createdAt: Date
    updatedAt: Date
  }

  interface UserSession {
    // Add your own fields
  }
}

export {}
