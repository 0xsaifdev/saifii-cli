import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { ApiResponse } from '../helpers/apiResponse';
import { asyncHandler } from '../helpers/asyncHandler';

export class UserController {
  static findAll = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, sort = '-createdAt', search } = req.query;
    const result = await UserService.findAll({
      page: Number(page),
      limit: Number(limit),
      sort: String(sort),
      search: search ? String(search) : undefined,
    });
    return ApiResponse.ok(res, result);
  });

  static findById = asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.findById(req.params.id);
    return ApiResponse.ok(res, { user });
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.update(req.params.id, req.body);
    return ApiResponse.ok(res, { user }, 'User updated');
  });

  static remove = asyncHandler(async (req: Request, res: Response) => {
    await UserService.remove(req.params.id);
    return ApiResponse.ok(res, null, 'User deleted');
  });
}
