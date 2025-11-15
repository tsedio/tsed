/**
 * Checks if a value is a symbol primitive.
 *
 * @public
 * @since v7.0.0
 */
export function isSymbol(target: any): target is symbol {
  return typeof target === "symbol";
}

/**
 * Checks if a value is a symbol primitive, Symbol object, or the Symbol constructor.
 *
 * @public
 * @since v7.0.0
 */
export function isSymbolOrSymbolClass(target: any): target is symbol {
  return typeof target === "symbol" || target instanceof Symbol || target === Symbol;
}
