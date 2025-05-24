export interface DbBoxer {
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

export interface DbFight {
    order: number
    id: string
    boxer1Id: string
    boxer2Id: string
    tournamentId: string
}

export interface DbTournament {
    id: string
    name: string
    userId: string
    date: string
}

export interface DbTournament_Boxer {
    id: string
    tournamentId: string
    boxerId: string
    expand: { boxerId: DbBoxer }
}
