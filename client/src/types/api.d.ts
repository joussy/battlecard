export interface ApiImportBoxer {
    name: string
    firstname: string
    birth_date: Date
    weight: number
    club: string
    gender: Gender
    license: string
}

type FileType = "pdf" | "xlsx" | "csv" | "png"
