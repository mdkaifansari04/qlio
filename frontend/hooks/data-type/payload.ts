export interface SignUpPayload {
  email: string
  password: string
  name: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface JobPayload {
  command: string
  priority: number
  timeout: number
  params?: string[]
}
