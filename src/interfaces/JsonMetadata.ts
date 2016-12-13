export interface IJsonMetadata<T> {
    name?: string,
    use?: {new(): T},
    isArray?: boolean
}