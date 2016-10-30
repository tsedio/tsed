/**
 * Get the class name.
 * @param targetClass
 */
export const getClassName = (targetClass: any) => typeof targetClass === "function"
    ? targetClass.name
    : targetClass.constructor.name;
/**
 * Get the class constructor.
 * @param targetClass
 */
export const getContructor = (targetClass: any): Function =>
    typeof targetClass === "function"
        ? targetClass
        : targetClass.constructor;