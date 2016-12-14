export interface IStaticJsonConverter {
    new (): IJsonConverter;
    (): IJsonConverter;
    /**
     *
     * @param data
     */
    deserialize?<T extends IStaticJsonConverter>(data: any, targetType?: IStaticJsonConverter): T;
    /**
     *
     * @param object
     */
    serialize?(object: any): string;
}

export interface IDefaultJsonConverter {
    /**
     *
     * @param data
     */
    deserialize?<T extends IStaticJsonConverter>(data: any, targetType?: IStaticJsonConverter): T;
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
