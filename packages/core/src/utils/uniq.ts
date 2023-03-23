/**
 * @param list
 */
export function uniq<T = any>(list: T[]): T[] {
  return Array.from(new Set(list).values());
}

export function uniqBy<T = any>(list: T[], key = "id"): T[] {
  const map = new Map();

  list.forEach((item: any) => {
    map.set(item[key], item);
  });

  return Array.from(map.values());
}
