export function isMongoId(text: string) {
  return text.toString().match(/^[0-9a-fA-F]{24}$/);
}
