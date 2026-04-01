import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'bookmystay_compare_ids';
const MAX_ITEMS = 4;

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [ids, setIds] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(raw || '[]');
      return Array.isArray(parsed) ? parsed.filter(Boolean).slice(0, MAX_ITEMS) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent('compare-change'));
  }, [ids]);

  const toggle = useCallback((id) => {
    if (!id) return;
    setIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_ITEMS) return [...prev.slice(1), id];
      return [...prev, id];
    });
  }, []);

  const has = useCallback((id) => ids.includes(id), [ids]);

  const remove = useCallback((id) => {
    setIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  const value = useMemo(
    () => ({ ids, count: ids.length, toggle, has, remove, clear }),
    [ids, toggle, has, remove, clear]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
