export function tsvToJson(tsvText: string, headers: string[]): any[] {
    //Split all the text into seperate lines on new lines and carriage return feeds
    var allTextLines = tsvText.split(/\r\n|\n/);
    //Split per line on tabs and commas
    // var headers = allTextLines[0].split(/\t|,/);
    var lines = [];

    for (var i = 0; i < allTextLines.length; i++) {
      var data = allTextLines[i].split(/\t|,|;/);

      var row: any = {};
      for (var j = 0; j < headers.length; j++) {
        row[headers[j]] = data[j];
      }
      lines.push(row);
    }

    return lines;
}