const base = import.meta.env.BASE_URL;
export const asset = (path) =>
  path ? base + path.replace(/^\//, '') : path;
