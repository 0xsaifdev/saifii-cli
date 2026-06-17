import { User } from '../models/user.model';
import { generateTokens, verifyRefreshToken } from '../helpers/jwt';
import { AppError } from '../helpers/appError';

interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

interface LoginDto {
  email: string;
  password: string;
}

export class AuthService {
  static async register(dto: RegisterDto) {
    const existing = await User.findOne({ email: dto.email.toLowerCase() });
    if (existing) throw new AppError('Email already in use', 409);

    const user = await User.create(dto);
    return user.toSafeObject();
  }

  static async login(dto: LoginDto) {
    const user = await User.findOne({ email: dto.email.toLowerCase() }).select('+password');
    if (!user) throw new AppError('Invalid credentials', 401);

    const isMatch = await user.comparePassword(dto.password);
    if (!isMatch) throw new AppError('Invalid credentials', 401);

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    user.refreshToken = refreshToken;
    user.lastLoginAt = new Date();
    await user.save();

    return { user: user.toSafeObject(), accessToken, refreshToken };
  }

  static async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
  }

  static async refreshAccessToken(token: string) {
    if (!token) throw new AppError('Refresh token required', 401);

    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.sub).select('+refreshToken');

    if (!user || user.refreshToken !== token) {
      throw new AppError('Invalid refresh token', 401);
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);
    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken };
  }
}
