const base = import.meta.env.BASE_URL;
export const asset = (path) => {
  if (!path) return path;
  // External URLs (http/https/protocol-relative): pass through unchanged
  if (/^(https?:)?\/\//.test(path)) return path;
  return base + path.replace(/^\//, '');
};
