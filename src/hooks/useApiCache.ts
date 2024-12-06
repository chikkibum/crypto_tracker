import { useState, useEffect } from 'react';
import axios from 'axios';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const cache: { [key: string]: CacheItem<any> } = {};
const CACHE_DURATION = 30000; // 30 seconds
const RATE_LIMIT_ERROR = "Too many requests - API rate limit exceeded. Please try again later.";
const CORS_ERROR = "CORS error occurred. Please try again later.";

/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useApiCache<T>(url: string, _dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check cache
        const cachedData = cache[url];
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
          setData(cachedData.data);
          setLoading(false);
          return;
        }

        // Fetch new data
        const response = await axios.get(url);
        
        // Cache the response
        cache[url] = {
          data: response.data,
          timestamp: Date.now()
        };

        setData(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 429) {
            setError(RATE_LIMIT_ERROR);
          } else if (err.message.includes('CORS')) {
            setError(CORS_ERROR);
          } else {
            setError(err.message || 'An error occurred');
          }
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}
