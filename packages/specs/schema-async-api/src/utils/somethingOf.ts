export function makeOf(key: string, schemes: unknown[]) {
  if (schemes.length) {
    if (schemes.length === 1) {
      return schemes[0];
    } else {
      return {[key]: schemes};
    }
  }

  return null;
}
