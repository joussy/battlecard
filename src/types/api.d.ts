export interface ApiBoxer {
    name: string
    firstname: string
    birth_date: Date
    weight: number
    club: string
    gender: Gender
    license: string
}

export interface BoxerExtraInfo {
    boxerId: string
    category: string
}

type FileType = "pdf" | "xlsx" | "csv" | "png"
