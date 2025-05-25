export interface ApiImportBoxer {
    name: string
    firstname: string
    birth_date: Date
    weight: number
    club: string
    gender: Gender
    license: string
}

export interface FightExtraInfo {
    fightId: string
    duration: string
    boxer1Category: string
    boxer2Category: string
}

type FileType = "pdf" | "xlsx" | "csv" | "png"
