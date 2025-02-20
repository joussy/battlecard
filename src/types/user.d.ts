export interface UserAccount {
    id: string
    name: string | null
    email: string | null
    avatar: string | null
    apiEnabled: boolean
    authToken: string
}
