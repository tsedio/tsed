/**
 * Retourne le constructeur d'une cible. Si `target` est déjà une classe
 * (fonction constructeur), elle est renvoyée telle quelle; si c'est une
 * instance, son constructeur est renvoyé.
 *
 * @param target Instance ou constructeur.
 * @returns Le constructeur associé à la cible.
 * @example
 * ```ts
 * class A {}
 * getClass(A) === A; // true
 * getClass(new A()) === A; // true
 * ```
 */
export function getClass(target: any): any {
  return target.prototype ? target : target.constructor;
}

/**
 * Alias de `getClass`.
 * @see getClass
 */
export function classOf(target: any) {
  return getClass(target);
}
