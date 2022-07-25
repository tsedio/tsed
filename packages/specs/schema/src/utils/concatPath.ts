export function concatPath(basePath: string | undefined | RegExp, path: string | undefined | RegExp): any {
  if (basePath instanceof RegExp || path instanceof RegExp) {
    if (!basePath) {
      return path;
    }

    if (!path) {
      return basePath;
    }

    const r1 = basePath instanceof RegExp ? basePath : new RegExp(basePath, "gi");
    const r2 = path instanceof RegExp ? path : new RegExp(path, "gi");

    return new RegExp(r1.source + r2.source, (r1.global ? "g" : "") + (r1.ignoreCase ? "i" : "") + (r1.multiline ? "m" : ""));
  }

  if (basePath && path && basePath.endsWith("/") && path.startsWith("/")) {
    path = path.slice(1);
  }

  const result = (basePath || "") + (path || "");

  return result.endsWith("/") && result.length > 1 ? result.slice(0, -1) : result;
}
