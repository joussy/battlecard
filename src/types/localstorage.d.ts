import { BoxerAttributes } from "@/types/boxing.d"

export interface BoxerStorage {
    attributes: BoxerAttributes
}

export interface FightStorage {
    order: number
    boxer1Id: string
    boxer2Id: string
}

export interface FightCardStorage {
    boxers: BoxerStorage[]
    fightCard: FightStorage[]
}
