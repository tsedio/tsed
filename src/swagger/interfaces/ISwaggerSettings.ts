import {
    BodyParameter,
    ExternalDocs,
    Info,
    Path,
    QueryParameter,
    Response,
    Schema,
    Security,
    Tag
} from "swagger-schema-official";

declare interface IServerSettings {
    swagger: ISwaggerSettings;
}

export interface ISwaggerSettings {
    path: string;
    cssPath?: string;
    options?: any;
    showExplorer?: boolean;
    specPath?: string;
    spec?: {
        swagger?: string;
        info?: Info;
        externalDocs?: ExternalDocs;
        host?: string;
        basePath?: string;
        schemes?: string[];
        consumes?: string[];
        produces?: string[];
        paths?: { [pathName: string]: Path };
        definitions?: { [definitionsName: string]: Schema };
        parameters?: { [parameterName: string]: BodyParameter | QueryParameter };
        responses?: { [responseName: string]: Response };
        security?: Array<{ [securityDefinitionName: string]: string[] }>;
        securityDefinitions?: { [securityDefinitionName: string]: Security };
        tags?: Tag[];
    };
}