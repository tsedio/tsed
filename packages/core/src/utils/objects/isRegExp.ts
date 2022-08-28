export function isRegExp(target: any): target is RegExp {
  return target instanceof RegExp;
}
