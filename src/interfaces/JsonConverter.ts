export interface IStaticJsonConverter extends FunctionConstructor {
    new (): IJsonConverter;
    (): IJsonConverter;
    /**
     *
     * @param data
     */
    deserialize?<T extends FunctionConstructor>(data: any, targetType?: IStaticJsonConverter): T;
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
