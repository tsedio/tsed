/**
 * Type utilitaire qui produit l'union de toutes les valeurs d'un type objet `T`.
 *
 * @example
 * ```ts
 * type T = {a: 1; b: 2};
 * type V = ValueOf<T>; // 1 | 2
 * ```
 * @public
 */
export type ValueOf<T> = T[keyof T];
