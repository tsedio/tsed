export function isCommonjs() {
  return typeof module !== "undefined" && typeof exports !== "undefined";
}

export function isEsm() {
  return !isCommonjs();
}
