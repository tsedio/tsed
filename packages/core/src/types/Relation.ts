/**
 * Marqueur de type permettant d'exprimer une relation entre modèles/DTOs.
 *
 * Dans certains contextes, `Relation<T>` est utilisé pour indiquer qu'une propriété
 * représente une entité liée de type `T`. Il s'agit d'un alias transparent de `T`
 * servant surtout la documentation et l'intention.
 *
 * @typeParam T Type de la ressource liée.
 * @public
 */
export type Relation<T> = T;
