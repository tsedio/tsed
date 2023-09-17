export function hasJsonMethod(obj: any) {
  return obj && typeof obj.toJSON === "function";
}
