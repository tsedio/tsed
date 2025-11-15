/**
 * Returns a new array with duplicate values removed.
 *
 * @public
 * @since v7.0.0
 */
export function uniq<T = any>(list: T[]): T[] {
  return Array.from(new Set(list).values());
}

/**
 * Returns a new array with duplicate objects removed based on a specified property key.
 *
 * @public
 * @since v7.0.0
 */
export function uniqBy<T = any>(list: T[], key = "id"): T[] {
  const map = new Map();

  list.forEach((item: any) => {
    map.set(item[key], item);
  });

  return Array.from(map.values());
}
