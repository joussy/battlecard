export interface ApiBoxerGet {
    id: string
    lastName: string
    firstName: string
    birthDate: string
    nbFights?: number
    club: string
    weight?: number
    gender?: "male" | "female"
    license: string
    userId: string
    created?: string
    updated?: string
}

export interface ApiBoxerCreate {
    lastName: string
    firstName: string
    birthDate: string
    nbFights?: number
    club: string
    weight?: number
    gender: "male" | "female"
    license: string
    tournamentId?: string
}

export interface ApiFight {
    order: number
    id: string
    boxer1Id: string
    boxer2Id: string
    tournamentId: string
}

export interface ApiTournament {
    id: string
    name: string
    userId: string
    date: string
}

export interface ApiTournament_Boxer {
    id: string
    tournamentId: string
    boxerId: string
}
