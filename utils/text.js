import { createTransaction, getAccount } from '@/prisma/queries';
import { convertStringToDate } from './convert';
import prisma from './db';

const fs = require('fs');
const readline = require('readline');

export async function processFile(filePath) {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity, // handles different OS line endings
  });
  const accounts = new Set();
  const credit = await prisma.account.findFirst({ where: { name: 'Cash' } });
  for await (const line of rl) {
    // Split line into parts
    const parts = line.split('||').map((part) => part.trim());

    // Example: Assume the date is in parts[2]
    const dateString = parts[0];
    //
    // console.log(`Date found: ${dateString}`);

    // Analyze date
    const date = convertStringToDate(dateString);
    if (date && parts[10] != 'Cash') {
      if (!parts[3].startsWith('ATM')) {
        console.log(`Valid Date: ${date.toISOString()}`);
        console.log(parts[3], parts[10], parts[12]);
        const account = await getAccount({ name: parts[10] });
        if (!account) throw new Error('Account does not exist!');
        const data = {
          date: date,
          description: parts[3],
          amount: parts[12],
          debitId: account.id,
          creditId: credit.id,
        };
        await createTransaction(data);
        //break;
        accounts.add(parts[10]);
      }
    } else if (!date) {
      console.log(`Invalid date format: ${dateString}`);
      throw new Error('Date error');
    }
  }

  //   console.log(accounts);
  //   accounts.forEach(async (a) => {
  //     const account = await getAccount({ name: a });
  //     if (!account) console.log('Does not exist: ', a);
  //     else console.log('exists: ', a);
  //   });
}
