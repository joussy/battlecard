export function tsvToJson(tsvText: string, headers: string[]): any[] {
    //Split all the text into seperate lines on new lines and carriage return feeds
    const allTextLines = tsvText.split(/\r\n|\n/);
    //Split per line on tabs and commas
    // var headers = allTextLines[0].split(/\t|,/);
    const lines = [];

    for (let i = 0; i < allTextLines.length; i++) {
      const data = allTextLines[i].split(/\t|,|;/);

      const row: any = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = data[j];
      }
      lines.push(row);
    }

    return lines;
}