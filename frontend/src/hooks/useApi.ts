import { useState, useEffect, useRef } from "react";

type Data<T> = T | null;
type ErrorType = Error | null;

interface ApiRequestParams<TRequest> {
  id?: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: TRequest;
  headers?: Record<string, string>;
  autoFetch?: boolean;
}

export const useApi = <TRequest = unknown, TResponse = TRequest>({ id, url, method, headers, autoFetch = false }: ApiRequestParams<TRequest>) => {
  const [data, setData] = useState<Data<TResponse>>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorType>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const trigger = async (body?: TRequest) => {

    if (!url) return;

    // Cancelar petición anterior si existe
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    // Crear nuevo controller para esta petición
    const controller = new AbortController();
    controllerRef.current = controller;

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

      const jsonData: TResponse = await response.json();

      if (!response.ok) {
        const backendMessage = (jsonData as unknown as { message: string })?.message;
        const errorMessage = "Error: " + backendMessage || `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      setData(jsonData);
      setError(null);

      return jsonData;
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (autoFetch && method === 'GET') {
      trigger();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, method, autoFetch]);

  // Cleanup: cancelar petición pendiente cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  return { data, loading, error, trigger };
}; 