/**
 * Gets the name of a class from a constructor function or instance.
 *
 * @public
 * @since v7.0.0
 */
export function nameOfClass(targetClass: any): string {
  return typeof targetClass === "function" ? targetClass.name : targetClass.constructor.name;
}

/**
 * Extracts the name from a symbol by removing the Symbol() wrapper.
 *
 * @public
 * @since v7.0.0
 */
export const nameOfSymbol = (sym: symbol): string => sym.toString().replace("Symbol(", "").replace(")", "");

/**
 * Gets the name of any object including symbols, functions, and classes.
 *
 * @public
 * @since v7.0.0
 */
export function nameOf(obj: any): string {
  switch (typeof obj) {
    default:
      return "" + obj;
    case "symbol":
      return nameOfSymbol(obj);
    case "function":
      return nameOfClass(obj);
  }
}
