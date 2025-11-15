/**
 * Type marker for expressing a relationship between models/DTOs.
 *
 * In some contexts, `Relation<T>` is used to indicate that a property represents a related entity of type `T`. It is a transparent alias for `T`, primarily serving documentation and intent.
 *
 * @typeParam Resource Type
 * @public
 */
export type Relation<T> = T;
