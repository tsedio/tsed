/**
 * @module swagger
 */
import {Operation, Path, Response} from "swagger-schema-official";
import {EndpointMetadata} from "../../mvc/class/EndpointMetadata";
import {toSwaggerPath} from "../utils";
import {OpenApiParamsBuilder} from "./OpenApiParamsBuilder";
import {OpenApiPropertiesBuilder} from "./OpenApiPropertiesBuilder";

/** */

const OPERATION_IDS: any = {};

const getOperationId = (operationId: string) => {
    if (OPERATION_IDS[operationId] === undefined) {
        OPERATION_IDS[operationId]++;
        operationId = operationId + "_" + OPERATION_IDS[operationId];
    } else {
        OPERATION_IDS[operationId] = 0;
    }
    return operationId;
};

export class OpenApiEndpointBuilder extends OpenApiPropertiesBuilder {
    private _paths: { [pathName: string]: Path } = {};


    constructor(private endpoint: EndpointMetadata, private endpointUrl: string) {
        super(endpoint.target);
    }

    build(): this {

        const openAPIPath = ("" + toSwaggerPath(`${this.endpointUrl}${this.endpoint.path || ""}`)).trim();
        const produces = this.endpoint.store.get("produces") || [];
        const consumes = this.endpoint.store.get("consumes") || [];
        const responses = this.endpoint.store.get("responses") || {"200": {description: "Success"}};
        const summary = this.endpoint.store.get("summary") || "";
        const deprecated = this.endpoint.store.get("deprecated") || false;
        const security = this.endpoint.store.get("security");
        const operationId = getOperationId(`${this.endpoint.targetName}.${this.endpoint.methodClassName}`);
        const openApiParamsBuilder = new OpenApiParamsBuilder(this.endpoint.target, this.endpoint.methodClassName);
        openApiParamsBuilder
            .build()
            .completeMissingPathParams(openAPIPath);

        if (!this._paths[openAPIPath]) this._paths[openAPIPath] = {};

        const path: any = this._paths[openAPIPath];
        const operation: Operation = {
            operationId,
            tags: [this.endpoint.targetName],
            parameters: openApiParamsBuilder.parameters,
            summary,
            consumes,
            responses,
            produces,
            security: security,
            deprecated
        };

        path[this.endpoint.httpMethod] = operation;

        Object.keys(responses).forEach(code => {
            responses[code] = this.createResponse(code, responses[code]);
        });

        Object.assign(this._definitions, openApiParamsBuilder.definitions);

        return this;
    }

    private createResponse(code: string | number, options: any): Response {
        const {description = "Success", headers} = options;
        const response: Response = {description, headers};

        this.endpoint.statusResponse(code);

        if (this.endpoint.type === undefined) {
            return response;
        }

        response.schema = this.createSchema(this.endpoint);

        return response;
    }

    public get paths(): { [p: string]: Path } {
        return this._paths;
    }
}