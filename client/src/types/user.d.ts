export interface UserAccount {
    id: string
    name: string | null
    email: string | null
    picture: string | null
    apiEnabled: boolean
    authToken: string
}
