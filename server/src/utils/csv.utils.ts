import { parse, Options } from 'csv-parse';
import { stringify, Options as StringifyOptions } from 'csv-stringify';

export function parseCsvAsync(
  csvString: string,
  options: Options,
): Promise<unknown[]> {
  return new Promise((resolve, reject) => {
    parse(
      csvString,
      { columns: true, trim: true, bom: true, ...options },
      (err, records: unknown[]) => {
        if (err) reject(err);
        else resolve(records);
      },
    );
  });
}

export function stringifyCsvAsync(
  records: unknown[],
  options: StringifyOptions,
): Promise<string> {
  return new Promise((resolve, reject) => {
    stringify(records, options, (err, output) => {
      if (err) reject(err);
      else resolve(output);
    });
  });
}
