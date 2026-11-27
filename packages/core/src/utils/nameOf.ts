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
export const nameOfSymbol = (sym: symbol): string => {
  const description = sym.description;

  // description is a plain read: toString() and two replace() cost ~10x more.
  // A description holding ")" keeps the previous result, where the first ")" was removed
  if (description === undefined) {
    return "";
  }

  return description.indexOf(")") === -1 ? description : sym.toString().replace("Symbol(", "").replace(")", "");
};

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
