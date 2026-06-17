import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../helpers/apiResponse';
import { asyncHandler } from '../helpers/asyncHandler';

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.register(req.body);
    return ApiResponse.created(res, { user }, 'Registration successful');
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await AuthService.login(req.body);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return ApiResponse.ok(res, { user, accessToken }, 'Login successful');
  });

  static logout = asyncHandler(async (req: Request, res: Response) => {
    await AuthService.logout(req.user!.id);
    res.clearCookie('refreshToken');
    return ApiResponse.ok(res, null, 'Logged out successfully');
  });

  static refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    const { accessToken } = await AuthService.refreshAccessToken(token);
    return ApiResponse.ok(res, { accessToken });
  });

  static me = asyncHandler(async (req: Request, res: Response) => {
    return ApiResponse.ok(res, { user: req.user });
  });
}
