export const ls = (k: string, d: string): string => { try { return localStorage.getItem(k) || d } catch { return d } }
export const lsSet = (k: string, v: string): void => { try { localStorage.setItem(k, v) } catch {} }
export const t18 = <T extends Record<string, unknown>>(obj: T | undefined | null, lang: string): T[keyof T] | Record<string, never> =>
  (obj as Record<string, unknown>)?.[lang] as T[keyof T] || (obj as Record<string, unknown>)?.en as T[keyof T] || {} as Record<string, never>
