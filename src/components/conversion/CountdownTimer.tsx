'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  expiresAt: string;
  onExpire?: () => void;
}

export default function CountdownTimer({ expiresAt, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const update = () => {
      const remaining = new Date(expiresAt).getTime() - Date.now();
      if (remaining <= 0) {
        setTimeLeft('00:00:00');
        onExpire?.();
        return;
      }

      setIsUrgent(remaining < 5 * 60 * 1000);

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  return (
    <span
      className={`font-mono font-bold text-sm tabular-nums ${
        isUrgent ? 'text-red-400 animate-pulse' : 'text-white'
      }`}
    >
      {timeLeft}
    </span>
  );
}
