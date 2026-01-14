import { useState, useEffect, useCallback } from 'react';

export const useCurrentTime = (update_interval: number = 1000): string => {
  const format_time = useCallback((): string => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }, []);

  const [time, set_time] = useState<string>(format_time());

  useEffect(() => {
    const interval = setInterval(() => {
      set_time(format_time());
    }, update_interval);

    return () => clearInterval(interval);
  }, [format_time, update_interval]);

  return time;
};
