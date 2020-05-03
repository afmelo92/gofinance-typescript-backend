import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

interface Request {
  fileName: string;
}

interface Response {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  public async execute({ fileName }: Request): Promise<Response[]> {
    const csvFilePath = path.resolve(__dirname, '..', '..', `tmp/${fileName}`);
    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      from_line: 1,
      ltrim: true,
      rtrim: true,
      columns: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines: any[] | PromiseLike<Response[]> = [];

    parseCSV.on('data', line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    return lines;
  }
}

export default ImportTransactionsService;
