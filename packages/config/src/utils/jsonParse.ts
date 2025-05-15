export function jsonParse(value: string): any {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}
