import {
    BodyParameter, ExternalDocs, Header, Info, Path, QueryParameter, Schema, Security, Tag
} from "swagger-schema-official";
import {Type} from "../../core/interfaces/Type";

export interface ISwaggerPaths {
    [pathName: string]: Path;
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

export interface IResponsesOptions {
    description?: string;
    use?: Type<any>;
    collection?: Type<any>;
    headers?: { [headerName: string]: Header };
}