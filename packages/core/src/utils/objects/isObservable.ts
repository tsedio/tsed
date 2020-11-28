export function isObservable<T>(obj: any): boolean {
  return !!obj && typeof obj.lift === "function" && typeof obj.subscribe === "function";
}
