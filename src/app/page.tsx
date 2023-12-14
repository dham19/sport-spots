'use client';

import { useSession, signIn } from 'next-auth/react';
import HomePage from './HomePage';

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      {session && status === 'authenticated' ? (
        <HomePage />
      ) : (
        <div className='flex flex-col'>
          <h1 className='text-3xl font-bold'>Yurbo</h1>

          <button
            className='btn-primary mt-20'
            onClick={() => signIn('google')}
          >
            Sign In
          </button>
        </div>
      )}
    </main>
  );
}
