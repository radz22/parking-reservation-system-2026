
import { RegisterRequest, LoginRequest } from '@/types/auth';
import { hashText, compareTextToHashedText } from '@/utils/brycpt';
import { prisma } from '@/lib/prisma';
import { CustomError } from '@/utils/custom-error';
import { generateTokens, verifyRefreshToken } from '@/utils/jwt';

export const register = async (req: RegisterRequest) => {
  const { email, password, username, role } = req;
  const hashedPassword = await hashText(password);
  
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new CustomError('User already exists', 400);
  }

  const prismaRole = role.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER';

  const user = await prisma.user.create({
    data: { 
      email, 
      username, 
      password: hashedPassword, 
      role: prismaRole 
    },
  });

  return user;
};

export const login = async (req: LoginRequest) => {
  const { email, password } = req;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  const isPasswordValid = await compareTextToHashedText(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new CustomError('Invalid email or password', 401);
  }


  const { accessToken, refreshToken } = generateTokens(
    user.id,
    user.email,
    user.username,
    user.role
  );

  return { 
    accessToken, 
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    }
  };
};


export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    const tokens = generateTokens(
      user.id,
      user.email,
      user.username,
      user.role
    );

    return tokens;
  } catch (error) {
    throw new CustomError('Invalid or expired refresh token', 401);
  }
};

