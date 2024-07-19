import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const allowedPaths = ['/authentication', '/admin'] as const;

type AllowedPaths = (typeof allowedPaths)[number];

export const authenticationPath = '/authentication';
export const arrivalPath = '/admin';
export const tokenName = 'J_T';

export function isAuthRequiredPaths(path: string): path is AllowedPaths {
  return allowedPaths.includes(path as AllowedPaths);
}

async function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get(tokenName)?.value;

  if (token) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET!)
      );

      if (payload.password === process.env.PASSWORD) {
        return true;
      }
    } catch (error) {
      // Error Logging Code
    }
  }

  return false;
}

export async function auth(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (await isAuthenticated(request)) {
    if (pathname === authenticationPath) {
      request.nextUrl.pathname = arrivalPath;
      return NextResponse.redirect(request.nextUrl);
    }

    return NextResponse.next();
  }

  if (pathname === authenticationPath) {
    const response = NextResponse.next();
    response.cookies.delete(tokenName);
    return response;
  }

  request.nextUrl.pathname = authenticationPath;
  return NextResponse.redirect(request.nextUrl);
}
