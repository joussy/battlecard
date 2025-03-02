export function generateRandomId(): string {
    return `%${(Math.random() + 1).toString(36)}`
}
