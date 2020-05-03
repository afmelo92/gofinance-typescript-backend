import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find({
    select: ['id', 'title', 'value', 'created_at', 'updated_at'],
    relations: ['category_id'],
  });
  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  deleteTransaction.execute({ id });

  return response.json({ id });
});

transactionsRouter.post(
  '/import',
  upload.single('sheet'),
  async (request, response) => {
    const importTransactionService = new ImportTransactionsService();

    const fileContent = await importTransactionService.execute({
      fileName: request.file.filename,
    });

    const createTransaction = new CreateTransactionService();

    fileContent.forEach(item => {
      const { title, value, type, category } = item;
      createTransaction.execute({
        title,
        value,
        type,
        category,
      });
    });

    // return response.json(user);
    return response.json(fileContent);
  },
);

export default transactionsRouter;
