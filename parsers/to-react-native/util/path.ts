export const join = (dir: string, fileName: string) => {
  let path = '';
  if (!dir.startsWith('.')) {
    path += './';
  }
  path += dir;
  if (!path.endsWith('/')) {
    path += '/';
  }
  return path + fileName;
};
