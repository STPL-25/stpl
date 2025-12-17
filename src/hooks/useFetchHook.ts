import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

type Params = Record<string, any> | null;

interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Generic useFetch hook.
 * @example
 * const { data, loading, error } = useFetch<MyType>("/api/items", "query", { page: 1 });
 */
const useFetch = <T = any>(
  url: string,
  query: string = "",
  params: Params = null
): UseFetchReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Ensure these environment values are typed as strings or undefined
  const username = (import.meta.env.VITE_USER_NAME as string) || undefined;
  const password = (import.meta.env.VITE_USER_PASSWORD as string) || undefined;

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setData(null);

        const endpoint = query ? `${url}/${query}` : url;

        const config: AxiosRequestConfig = {
          params: params ?? undefined,
          signal: controller.signal as unknown as AbortSignal, // axios supports `signal` in recent versions
        };

        if (username && password) {
          config.auth = { username, password };
        }

        const response: AxiosResponse<T> = await axios.get(endpoint, config);
        setData(response.data);
      } catch (err: any) {
        // if request was aborted, axios throws a DOMException with name 'CanceledError' in new versions
        if (controller.signal.aborted) {
          // request was cancelled — keep behavior similar to original
          console.log("Request cancelled", err);
        } else {
          const message =
            err?.response?.data?.message || err?.message || "An error occurred";
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, JSON.stringify(params), query]);

  return { data, loading, error };
};

export default useFetch;
