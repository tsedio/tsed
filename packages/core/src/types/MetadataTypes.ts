import type {Type} from "./Type.js";

/**
 * Modèle générique décrivant les types associés à une valeur de métadonnée.
 *
 * Permet d'indiquer le type de l'élément (`type`) et, le cas échéant, le type
 * de la collection qui le contient (`collectionType`).
 *
 * @typeParam T Type de l'élément.
 * @typeParam C Type de la collection si applicable (ex: `Array<T>`, `Set<T>`).
 * @public
 */
export interface MetadataTypes<T = any, C = any> {
  /** Type de l'élément (constructeur ou instance). */
  type?: Type<T> | T;
  /** Type de la collection (constructeur ou instance) si applicable. */
  collectionType?: Type<C> | C;
}
