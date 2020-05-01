import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const incomeTransactions = await this.find({
      where: {
        type: 'income',
      },
    });

    const income = incomeTransactions.reduce((sum, transaction) => {
      sum += transaction.value;
      return sum;
    }, 0);

    const outcomeTransactions = await this.find({
      where: {
        type: 'outcome',
      },
    });

    const outcome = outcomeTransactions.reduce((sum, transaction) => {
      sum += transaction.value;
      return sum;
    }, 0);

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
