import { User } from '../models/user.model';
import { AppError } from '../helpers/appError';
import { paginate } from '../helpers/paginate';

interface FindAllOptions {
  page: number;
  limit: number;
  sort: string;
  search?: string;
}

export class UserService {
  static async findAll(options: FindAllOptions) {
    const { page, limit, sort, search } = options;

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return paginate(users, { total, page, limit });
  }

  static async findById(id: string) {
    const user = await User.findById(id).lean();
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  static async update(id: string, dto: Partial<{ name: string }>) {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true, runValidators: true }
    ).lean();
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  static async remove(id: string) {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new AppError('User not found', 404);
  }
}
