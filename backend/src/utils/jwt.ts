import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const QR_SECRET = process.env.JWT_QR_SECRET;

if (!JWT_SECRET || !REFRESH_SECRET || !QR_SECRET) {
  throw new Error('JWT secrets must be defined in environment variables');
}

interface TokenPayload {
  id: string;
  email: string;
  username: string;
  role: string;
  isVerified: boolean;
  isBanned: boolean;
  iss?: string;
  aud?: string;
  iat?: number;
  exp?: number;
}

interface QrCodePayload {
  id: string;
  slotId: string;
  iss?: string;
  aud?: string;
  iat?: number;
  exp?: number;
}

export const generateTokens = (
  id: string,
  email: string,
  username: string,
  role: string,
  isVerified: boolean,
  isBanned: boolean,
): { accessToken: string; refreshToken: string } => {
  const basePayload: TokenPayload = {
    id,
    email,
    username,
    role,
    isVerified,
    isBanned,
    iss: 'auth-service',
    aud: 'auth-app',
  };

  const accessToken = jwt.sign(
    {
      ...basePayload,
      tokenType: 'access',
    },
    JWT_SECRET,
    {
      expiresIn: '15m',
      algorithm: 'HS256',
    },
  );

  const refreshToken = jwt.sign(
    {
      ...basePayload,
      tokenType: 'refresh',
    },
    REFRESH_SECRET,
    {
      expiresIn: '30d',
      algorithm: 'HS256',
    },
  );

  return { accessToken, refreshToken };
};

export const generateQrCodeToken = (
  id: string,
  slotId: string,
  expiresIn: string = '3h',
): { qrCode: string } => {
  const payload: QrCodePayload = {
    id,
    slotId,
    iss: 'qr-service',
    aud: 'qr-code',
  };

  const qrCode = jwt.sign(
    {
      ...payload,
      tokenType: 'qr-access',
    },
    QR_SECRET!,
    {
      expiresIn: expiresIn as any,
      algorithm: 'HS256',
    },
  );

  return { qrCode };
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

export const verifyQrCodeToken = (token: string): QrCodePayload => {
  return jwt.verify(token, QR_SECRET, {
    algorithms: ['HS256'],
  }) as QrCodePayload;
};
