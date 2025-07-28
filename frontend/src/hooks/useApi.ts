import { useState, useEffect } from "react";

type Data<T> = T | null;
type ErrorType = Error | null;

interface ApiRequestParams<T> {
  id?: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: T;
  headers?: Record<string, string>;
  autoFetch?: boolean;
}

export const useApi = <T>({ id, url, method, headers, autoFetch = false }: ApiRequestParams<T>) => {
  const [data, setData] = useState<Data<T>>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorType>(null);

  const trigger = async (body?: T) => {

    if (!url) return;

    const controller = new AbortController();

    setLoading(true);

    try {
      const response = await fetch(id ? `${url}/${id}` : url, {
        method,
        body: body ? JSON.stringify(body) : undefined,
        headers: headers ? {
          ...headers,
          'Content-Type': 'application/json',
        } : { 'Content-Type': 'application/json' },
        signal: controller.signal
      })

      const jsonData: T = await response.json();

      if (!response.ok) {
        const backendMessage = (jsonData as unknown as { message: string })?.message;
        const errorMessage = "Error: " + backendMessage || `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      setData(jsonData);
      setError(null);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setError(error);
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }

  useEffect(() => {
    if (autoFetch && method === 'GET') {
      trigger();
    }
  }, [url, method, autoFetch]);

  return { data, loading, error, trigger };
}; 