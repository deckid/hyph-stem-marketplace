'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const CORRECT_PASSWORD = 'kashkat2026';
const STORAGE_KEY = 'kashkat-auth';

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
      setAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setAuthenticated(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  // Avoid hydration mismatch — render nothing until mounted
  if (!mounted) return null;

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8 px-6">
        <Image src="/kashkat-logo.jpeg" alt="KASHKAT" width={120} height={48} className="h-12 w-auto" />
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-72">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoFocus
            className={`w-full rounded-lg border bg-surface px-4 py-3 text-sm text-foreground placeholder-muted outline-none transition-colors focus:border-black ${
              error ? 'border-red-500 animate-shake' : 'border-border'
            }`}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-[#0A0A0A] px-4 py-3 text-sm font-medium text-[#F5F0E8] transition-colors hover:bg-[#4A4540]"
          >
            Enter
          </button>
          {error && (
            <p className="text-sm text-red-400">Wrong password</p>
          )}
        </form>
      </div>
    </div>
  );
}
