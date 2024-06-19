export function tsvToJson(tsvText: string, headers: string[]): Record<string, string>[] {
    // Split all the text into separate lines on new lines and carriage return feeds
    const allTextLines = tsvText.split(/\r\n|\n/)

    // Array to hold the resulting JSON objects
    const lines: Record<string, string>[] = []

    for (let i = 0; i < allTextLines.length; i++) {
        const data = allTextLines[i].split(/\t|,|;/)

        const row: Record<string, string> = {}
        for (let j = 0; j < headers.length; j++) {
            row[headers[j]] = data[j] || ""
        }
        lines.push(row)
    }

    return lines
}
