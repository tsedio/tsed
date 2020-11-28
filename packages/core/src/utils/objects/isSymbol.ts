/**
 *
 * @param target
 */
export function isSymbol(target: any): target is symbol {
  return typeof target === "symbol" || target instanceof Symbol || target === Symbol;
}
