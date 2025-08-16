import { differenceInYears } from "date-fns"

export function getFightDurationAsString(rounds: number, roundDurationAsSeconds: number): string {
    const minutes = Math.floor(roundDurationAsSeconds / 60)
    const seconds = roundDurationAsSeconds % 60
    const secondsAsText = seconds === 0 ? `${minutes}` : `${minutes},${seconds}`

    return `${rounds}x${secondsAsText}'`
}

export function getBoxerAge(birthDate: Date): number {
    return differenceInYears(new Date(), birthDate)
}
