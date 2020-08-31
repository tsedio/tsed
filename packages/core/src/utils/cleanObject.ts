/**
 * Remove undefined value
 * @param obj
 */

export function cleanObject(obj: any): any {
  return Object.entries(obj).reduce(
    (obj, [key, value]) =>
      value === undefined
        ? obj
        : {
            ...obj,
            [key]: value
          },
    {}
  );
}
