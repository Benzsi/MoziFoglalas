import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface Booking {
  nev?: string;
  email?: string;
  datum?: string;
  fo?: number;
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Mozi Jegy Foglalás';
  }
  async saveBooking(booking: Booking): Promise<void> {
    try {
      const csvPath = path.join(process.cwd(), 'foglalasok.csv');

      const quote = (s: any) => {
        if (s === undefined || s === null) return '""';
        const str = String(s).replace(/"/g, '""');
        return `"${str}"`;
      };

      const line = [quote(booking.nev), quote(booking.email), quote(booking.datum), quote(booking.fo)].join(',') + '\n';

      if (!fs.existsSync(csvPath)) {
        const header = 'Név,Email,Dátum,Létszám\n';
        await fs.promises.writeFile(csvPath, header + line, { encoding: 'utf8' });
      } else {
        await fs.promises.appendFile(csvPath, line, { encoding: 'utf8' });
      }
    } catch (err) {
      throw new InternalServerErrorException('Hiba');
    }
  }
}
