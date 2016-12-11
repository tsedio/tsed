export interface IStaticJsonConverter<T> {
    new(): IJsonConverter;
    /**
     *
     * @param data
     */
    deserialize?(data: any, targetType?: T): T;
    /**
     *
     * @param object
     */
    serialize?(object: T): string;
}

export interface IJsonConverter {
    deserialize?(data: any): void;
    serialize?();
    toJson?();
}
