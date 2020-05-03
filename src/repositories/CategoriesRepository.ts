import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

interface Request {
  category: string;
}

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async getCategory({ category }: Request): Promise<Category | null> {
    const findCategory = await this.findOne({
      where: {
        title: category,
      },
    });

    return findCategory || null;
  }
}

export default CategoriesRepository;
