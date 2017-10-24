import {Operation, Path, Response} from "swagger-schema-official";
import {Store} from "../../core/class/Store";
import {deepExtends} from "../../core/utils";
import {EndpointMetadata} from "../../mvc/class/EndpointMetadata";
import {toSwaggerPath} from "../utils";
import {OpenApiParamsBuilder} from "./OpenApiParamsBuilder";
import {OpenApiPropertiesBuilder} from "./OpenApiPropertiesBuilder";

/** */

const OPERATION_IDS: any = {};

const getOperationId = (operationId: string) => {
    if (OPERATION_IDS[operationId] !== undefined) {
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
        const produces = this.endpoint.get("produces") || [];
        const consumes = this.endpoint.get("consumes") || [];
        const responses = this.endpoint.get("responses") || {};
        const security = this.endpoint.get("security") || [];
        const operationId = getOperationId(`${this.endpoint.targetName}.${this.endpoint.methodClassName}`);
        const openApiParamsBuilder = new OpenApiParamsBuilder(this.endpoint.target, this.endpoint.methodClassName);

        openApiParamsBuilder
            .build()
            .completeMissingPathParams(openAPIPath);

        if (!this._paths[openAPIPath]) this._paths[openAPIPath] = {};

        deepExtends(responses, openApiParamsBuilder.responses);

        const path: any = this._paths[openAPIPath];
        const operation: Operation = {
            operationId,
            tags: [this.getTagName()],
            parameters: openApiParamsBuilder.parameters,
            consumes,
            responses,
            security,
            produces
        };

        deepExtends(operation, this.endpoint.get("operation") || {});

        path[this.endpoint.httpMethod] = operation;

        responses[this.endpoint.get("statusCode") || "200"] = {description: "Success"};

        Object.keys(responses).forEach(code => {
            responses[code] = this.createResponse(code, responses[code]);
        });

        Object.assign(this._definitions, openApiParamsBuilder.definitions);

        return this;
    }

    /**
     *
     * @returns {string}
     */
    private getTagName(): string {
        const clazz = this.endpoint.target;
        const ctrlStore = Store.from(clazz);
        const tag = ctrlStore.get("tag");
        const name = ctrlStore.get("name");
        return name || tag && tag.name || this.endpoint.targetName;
    }

    /**
     *
     * @param {string | number} code
     * @param options
     * @returns {Response}
     */
    private createResponse(code: string | number, options: Response): Response {

        const {description, headers, examples} = deepExtends(
            options,
            this.endpoint.statusResponse(code) || {}
        );

        const response: Response = {description, headers, examples};

        if (this.endpoint.type === undefined) {
            return response;
        }

        response.schema = this.createSchema(this.endpoint);

        return response;
    }

    /**
     *
     * @returns {}
     */
    public get paths(): { [p: string]: Path } {
        return this._paths;
    }
}