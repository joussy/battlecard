import { differenceInYears, format, formatDuration, intervalToDuration } from "date-fns"
import { getDateFnsLocale } from "./date.utils"

export function getFightDurationAsString(rounds: number, roundDurationAsSeconds: number): string {
    const minutes = Math.floor(roundDurationAsSeconds / 60)
    const seconds = roundDurationAsSeconds % 60
    const secondsAsText = seconds === 0 ? `${minutes}` : `${minutes},${seconds}`

    return `${rounds}x${secondsAsText}'`
}

export function getBoxerAge(birthDate: Date): number {
    return differenceInYears(new Date(), birthDate)
}

export function getBirthDateAndAge(birthDate: Date): string {
    const age = getBoxerAge(birthDate)
    const birthDateString = format(birthDate, "dd/MM/yyyy")
    return `${birthDateString} (${age})`
}
export function getAgeDifference(date1: Date, date2: Date): string {
    // Ensure we always get a positive duration by using the earlier date as start
    const start = date1 < date2 ? date1 : date2
    const end = date1 < date2 ? date2 : date1
    const duration = intervalToDuration({ start, end })
    return formatDuration(duration, { format: ["years", "months", "days"], locale: getDateFnsLocale() })
}

export function getFullAddress(
    address: string | undefined,
    zipCode: string | undefined,
    city: string | undefined
): string {
    // Build a pretty address string, skipping empty parts and using proper separators
    const parts = []
    if (address) parts.push(address.trim())
    if (zipCode) parts.push(zipCode.trim())
    if (city) parts.push(city.trim())
    return parts.filter(Boolean).join(", ")
}
