import type { JWT } from 'next-auth/jwt';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const ACCESS_MS = 15 * 60 * 1000;
const REFRESH_BEFORE_EXPIRY_MS = 60 * 1000;

async function refreshAccessToken(token: JWT): Promise<JWT> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl || !token.refreshToken) {
    return { ...token, error: 'RefreshAccessTokenError' };
  }

  try {
    const res = await fetch(`${apiUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const data = (await res.json()) as {
      message?: string;
      accessToken?: string;
      refreshToken?: string;
    };

    if (!res.ok || !data.accessToken) {
      console.error(
        'Admin token refresh failed:',
        data.message ?? res.statusText,
      );
      return { ...token, error: 'RefreshAccessTokenError' };
    }

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + ACCESS_MS - REFRESH_BEFORE_EXPIRY_MS,
      error: undefined,
    };
  } catch {
    return { ...token, error: 'RefreshAccessTokenError' };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
            {
              method: 'POST',
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
              headers: { 'Content-Type': 'application/json' },
            },
          );

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message);
          }

          if (data.user && data.accessToken && data.refreshToken) {
            if (data.user.role !== 'ADMIN') {
              throw new Error('Access denied. This portal is for admins only.');
            }
            return {
              ...data.user,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            };
          }

          return null;
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error('An unknown error occurred');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as {
          id: string;
          role: string;
          username: string;
          accessToken: string;
          refreshToken: string;
        };
        return {
          ...token,
          id: u.id,
          role: u.role,
          username: u.username,
          accessToken: u.accessToken,
          refreshToken: u.refreshToken,
          accessTokenExpires: Date.now() + ACCESS_MS - REFRESH_BEFORE_EXPIRY_MS,
          error: undefined,
        };
      }

      if (token.error === 'RefreshAccessTokenError') {
        return token;
      }

      const expires =
        typeof token.accessTokenExpires === 'number'
          ? token.accessTokenExpires
          : 0;

      if (expires > 0 && Date.now() < expires) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token.error === 'RefreshAccessTokenError') {
        session.error = 'RefreshAccessTokenError';
        if (session.user) {
          session.user.accessToken = '';
        }
        return session;
      }

      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.username = token.username as string;
        session.user.accessToken = token.accessToken as string;
      }
      session.error = undefined;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
