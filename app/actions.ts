'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { arrivalPath, tokenName } from '@/lib/auth';
import { SignJWT } from 'jose';

export async function authentication(formData: FormData) {
  if (formData.get('password') === process.env.PASSWORD) {
    const token = await new SignJWT({ password: process.env.PASSWORD })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

    cookies().set(tokenName, token, {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
    });

    redirect(arrivalPath);
  }
}
