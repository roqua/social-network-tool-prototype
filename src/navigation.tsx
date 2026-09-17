import { useEffect, useState, type MouseEvent, type PropsWithChildren } from "react";

// Minimal client-side navigation, since the template has no router. All
// state is in memory, so a full page load would throw away the user's work.
export function navigate(path: string) {
  window.history.pushState(null, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function usePathname(): string {
  const [pathname, setPathname] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return pathname;
}

export function Link({ to, className, children }: PropsWithChildren<{ to: string; className?: string }>) {
  const onClick = (e: MouseEvent) => {
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={to} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
