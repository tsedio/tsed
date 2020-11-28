export function isStream(obj: any): boolean {
  return obj !== null && typeof obj === "object" && typeof obj.pipe === "function";
}
