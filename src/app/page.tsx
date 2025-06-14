'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in by looking for token in cookies
    let isLoggedIn = false;
    try {
      const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
      }, {} as Record<string, string>);
      isLoggedIn = !!cookies["token"];
    } catch (error) {
      isLoggedIn = false;
    }

    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return <div></div>;
}
