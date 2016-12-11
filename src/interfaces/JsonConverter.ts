export interface IStaticJsonConverter {
    new?(): IJsonConverter;
    /**
     *
     * @param data
     */
    deserialize?<T>(data: any, targetType?: T): T;
    /**
     *
     * @param object
     */
    serialize?(object: any): string;
}

export interface IJsonConverter {
    deserialize?(data: any): void;
    serialize?();
    toJson?();
}
