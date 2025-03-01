import { BoxerAttributes } from "@/types/boxing.d"

export interface BoxerStorage {
    attributes: BoxerAttributes
    collapsed: boolean
}

export interface FightStorage {
    boxer1Id: string
    boxer2Id: string
}

export interface FightCardStorage {
    boxers: BoxerStorage[]
    fightCard: FightStorage[]
}

export interface UserStorage {
    darkMode: boolean
    hideNonMatchableOpponents: boolean
    hideFightersWithNoMatch: boolean
}
