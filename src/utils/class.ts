/**
 * Get the class name.
 * @param targetClass
 */
export const getClassName = (targetClass: any) => {

    if (typeof targetClass === "symbol") {
        return targetClass.toString();
    }

    return typeof targetClass === "function"
        ? targetClass.name
        : targetClass.constructor.name;
};

/**
 * Get the class constructor.
 * @param targetClass
 */
export const getContructor = (targetClass: any): Function =>
    typeof targetClass === "function"
        ? targetClass
        : targetClass.constructor;