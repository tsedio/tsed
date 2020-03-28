export function toJsonRegex(pattern: string | RegExp) {
  return String(pattern).replace(/^(\/)(.*)(\/)$/, "$2");
}
