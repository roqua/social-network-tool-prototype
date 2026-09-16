import { useCallback, useEffect, useState } from "react";

// Minimal reload-stable URL state, since the template has no router.
export function useSearchParam(key: string, fallback: string): [string, (value: string) => void] {
  const read = () => new URLSearchParams(window.location.search).get(key) ?? fallback;
  const [value, setValue] = useState(read);

  useEffect(() => {
    const onPop = () => setValue(read());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [key]);

  const set = useCallback(
    (next: string) => {
      const params = new URLSearchParams(window.location.search);
      params.set(key, next);
      window.history.replaceState(null, "", `?${params}`);
      setValue(next);
    },
    [key],
  );

  return [value, set];
}
