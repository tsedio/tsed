/**
 * Get the provide name.
 * @param targetClass
 */
export function nameOfClass(targetClass: any): string {
  return typeof targetClass === "function" ? targetClass.name : targetClass.constructor.name;
}

/**
 * Get symbol name.
 * @param sym
 */
export const nameOfSymbol = (sym: symbol): string => sym.toString().replace("Symbol(", "").replace(")", "");

/**
 * Get object name
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
