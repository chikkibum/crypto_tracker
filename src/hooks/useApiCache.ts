import { useState, useEffect } from 'react';
import axios from 'axios';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const cache: { [key: string]: CacheItem<any> } = {};
const CACHE_DURATION = 30000; // 30 seconds

export function useApiCache<T>(url: string, dependencies: any[] = []) {
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
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, ...dependencies]);

  return { data, loading, error };
}
