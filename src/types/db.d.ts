import Client from "pocketbase"

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
    userId?: string
    created?: string
    updated?: string
}

export interface DbFight {
    order: number
    id: string
    boxer1Id: string
    boxer2Id: string
    userId?: string
}

interface TypedPocketBase extends Client {
    collection(idOrName: "boxer"): RecordService<DbBoxer>
    collection(idOrName: "fight"): RecordService<DbFight>
}
