export const ls = (k, d) => { try { return localStorage.getItem(k) || d } catch { return d } }
export const lsSet = (k, v) => { try { localStorage.setItem(k, v) } catch {} }
export const t18 = (obj, lang) => obj?.[lang] || obj?.en || {}
