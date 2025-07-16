import { useEffect, useState } from "react";

// Define un tipo genérico para los datos que puede ser del tipo T o null
// Esto permite que el hook sea reutilizable para cualquier tipo de datos
// y que el estado inicial sea null hasta que se obtienen los datos
// Data<T> representa el estado de los datos obtenidos
// ErrorType representa el estado del error (si ocurre)
type Data<T> = T | null;
type ErrorType = Error | null;

// Interfaz para el objeto de retorno del hook
// Incluye los datos, el estado de carga y el error
interface Params<T> {
  data: Data<T>;      // Los datos obtenidos o null
  loading: boolean;  // true mientras se está cargando
  error: ErrorType;  // Error si ocurre, sino null
}

// Hook personalizado para hacer fetch de datos
// Recibe una URL y retorna un objeto con data, loading y error
// En TypeScript, la sintaxis para declarar una función genérica es poner <T> justo después del nombre de la función (o de la constante si es una arrow function). 
// <T> indica que la función es genérica.
// T es un tipo genérico que puedes usar dentro de la función para que sea reutilizable con cualquier tipo de dato.
// Cuando llamas a useFetch, puedes especificar el tipo de dato que esperas recibir (por ejemplo, un array de productos, un objeto, etc.).
export const useFetch = <T>(url: string): Params<T> => {
  const [data, setData] = useState<Data<T>>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorType>(null);

  // useEffect se ejecuta cada vez que cambia la URL
  // Así, si la URL cambia, se vuelve a hacer el fetch
  useEffect(() => {
    // Lo que queremos que se ejecute cada vez que cambie la URL, en este caso, el fetchData

    // Se crea un controlador de abortación para cancelar la petición si es necesario, por ejemplo, cuando se interrumpe la llamada a la API, la idea es cancelar la petición.
    const controller = new AbortController();

    // Se establece en true para que se muestre el loading (por más que esté en true por defecto en useState, no está demás indicarlo acá)
    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await fetch(url, controller);

        if (!response.ok) {
          throw new Error('Ocurrió un error al obtener los datos.');
        }

        // Parsea la respuesta como JSON y la guarda en el estado
        const jsonData: T = await response.json();
        setData(jsonData);
        // Si no hay error, se establece en null
        setError(null);
      } catch (error) {
        // Si ocurre un error, lo guarda en el estado de error
        setError(error as Error);
      } finally {
        // Al finalizar (éxito o error), marca que ya no está cargando
        setLoading(false);
      }
    };

    fetchData();

    // Se retorna una función que se ejecuta cuando el componente se desmonta, en este caso, se aborta la petición.
    return () => {
      controller.abort();
    }
  }, [url]); // Dependencia: se ejecuta cuando cambia la URL

  return { data, loading, error };
}