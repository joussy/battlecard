import { BoxerAttributes } from "@/types/boxing.d"

export interface BoxerStorage {
    attributes: BoxerAttributes
    collapsed: boolean
}

export interface FightStorage {
    boxer1Id: number
    boxer2Id: number
}

export interface DataStorage {
    boxers: BoxerStorage[]
    fightCard: FightStorage[]
    darkMode: boolean
    apiServerAddress: string
    hideNonMatchableOpponents: boolean
    hideFightersWithNoMatch: boolean
}
