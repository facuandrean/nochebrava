import { useState } from "react";

type ErrorType = Error | null;

interface ApiRequest {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
}

export const useApi = <T>({ url, method, headers }: ApiRequest) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorType>(null);

  const trigger = async (body?: T) => {
    setLoading(true);

    try {
      const response = await fetch(url, {
        method,
        body: body ? JSON.stringify(body) : undefined,
        headers: headers ? {
          ...headers,
          'Content-Type': 'application/json',
        } : { 'Content-Type': 'application/json' }
      })

      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      const jsonData: T = await response.json();
      setData(jsonData);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, trigger };
}; 