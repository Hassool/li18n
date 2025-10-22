export const isBrowser = typeof window !== "undefined";
export const safeLocalStorage = {
  get(key) {
    if (!isBrowser) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, val) {
    if (!isBrowser) return;
    try {
      localStorage.setItem(key, val);
    } catch {}
  },
};
