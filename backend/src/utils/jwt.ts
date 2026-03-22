import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !REFRESH_SECRET) {
  throw new Error('JWT secrets must be defined in environment variables');
}

interface TokenPayload {
  id: string;
  email: string;
  username: string;
  role: string;
  iss?: string;
  aud?: string;
  iat?: number;
  exp?: number;
}

export const generateTokens = (
  id: string,
  email: string,
  username: string,
  role: string
): { accessToken: string; refreshToken: string } => {
  const basePayload: TokenPayload = {
    id,
    email,
    username,
    role,
    iss: 'auth-service',
    aud: 'mobile-app',
  };

  const accessToken = jwt.sign(
    {
      ...basePayload,
      tokenType: 'access',
    },
    JWT_SECRET,
    {
      expiresIn: '15m', // Corrected time format (15mins → 15m)
      algorithm: 'HS256', // Explicit algorithm selection
    }
  );

  const refreshToken = jwt.sign(
    {
      ...basePayload,
      tokenType: 'refresh', // Explicit token type
    },
    REFRESH_SECRET,
    {
      expiresIn: '30d',
      algorithm: 'HS256',
    }
  );

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET, {
    algorithms: ['HS256'],
  }) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, REFRESH_SECRET, {
    algorithms: ['HS256'],
  }) as TokenPayload;
};
