import { Boxer } from "@/types/boxing"

export function getBoxerDisplayName(boxer: Boxer): string {
    return `${boxer.firstName} ${boxer.lastName}`
}
