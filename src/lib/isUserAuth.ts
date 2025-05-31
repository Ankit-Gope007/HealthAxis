import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export async function isUserAuth() {
  const session = await auth();
  if (!session) {
    redirect('/patient/login');
  }
  return session;
}