import {Schema} from "swagger-schema-official";

export interface OpenApiDefinitions {
    [definitionsName: string]: Schema;
}