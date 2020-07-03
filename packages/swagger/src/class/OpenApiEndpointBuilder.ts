import {EndpointMetadata, PathParamsType} from "@tsed/common";
import {deepClone, deepExtends, getValue, isArrayOrArrayClass, isPromise, Store} from "@tsed/core";
import {Operation, Path, Response} from "swagger-schema-official";
import {HTTP_STATUS_MESSAGES} from "../constants/httpStatusMessages";
import {OpenApiResponses} from "../interfaces/OpenApiResponses";
import {parseSwaggerPath} from "../utils";
import {OpenApiModelSchemaBuilder} from "./OpenApiModelSchemaBuilder";
import {OpenApiParamsBuilder} from "./OpenApiParamsBuilder";

/** */

export class OpenApiEndpointBuilder extends OpenApiModelSchemaBuilder {
  private _paths: {[pathName: string]: Path} = {};

  constructor(
    private endpoint: EndpointMetadata,
    private endpointUrl: string,
    private pathMethod: {path?: PathParamsType; method?: string},
    private getOperationId: (targetName: string, methodName: string) => string
  ) {
    super(endpoint.target);
  }

  /**
   *
   * @returns {}
   */
  public get paths(): {[p: string]: Path} {
    return this._paths;
  }

  /**
   *
   * @returns {this}
   */
  build(): this {
    parseSwaggerPath(this.endpointUrl, this.pathMethod.path).forEach(({path: endpointPath, pathParams}) => {
      const builder = new OpenApiParamsBuilder(this.endpoint.target, String(this.endpoint.propertyKey), pathParams).build();

      const path: any = this._paths[endpointPath] || {};

      path[this.pathMethod.method!] = this.createOperation(builder);

      Object.assign(this._definitions, builder.definitions);

      this._paths[endpointPath] = path;
    });

    return this;
  }

  /**
   *
   * @param {OpenApiResponses} builderResponses
   * @returns {OpenApiResponses}
   */
  private createResponses(builderResponses: OpenApiResponses): OpenApiResponses {
    const responses: any = this.endpoint.get("responses") || ({} as any);

    deepExtends(responses, builderResponses);

    Array.from(this.endpoint.responses.keys()).forEach(code => {
      responses[code] = this.createResponse(code, responses[code] || {});
    });

    return responses;
  }

  /**
   *
   * @returns {Operation}
   * @param builder
   */
  private createOperation(builder: OpenApiParamsBuilder): Operation {
    const operationId = this.getOperationId(this.endpoint.targetName, String(this.endpoint.propertyKey));
    const security = this.endpoint.get("security");
    const produces = this.endpoint.get("produces");
    const consumes = this.endpoint.get("consumes");

    return deepExtends(
      {
        operationId,
        tags: getValue("tags", this.endpoint.get("operation"), [this.getTagName()]),
        parameters: builder.parameters.length ? builder.parameters : undefined,
        consumes,
        responses: this.createResponses(builder.responses),
        security,
        produces
      },
      this.endpoint.get("operation") || {}
    );
  }

  /**
   *
   * @returns {string}
   */
  private getTagName(): string {
    const clazz = this.endpoint.provide;
    const ctrlStore = Store.from(clazz);
    const tag = ctrlStore.get("tag");
    const name = ctrlStore.get("name");

    return name || (tag && tag.name) || this.endpoint.targetName;
  }

  /**
   *
   * @param {string | number} code
   * @param options
   * @returns {Response}
   */
  private createResponse(code: string | number, options: any): Response {
    const {type, collectionType, code: _, headers, ...obj} = {
      ...options,
      ...this.endpoint.statusResponse(code)
    } as any;

    const response = deepClone(obj);

    response.description = response.description || HTTP_STATUS_MESSAGES[String(code)] || "";

    if (type) {
      response.schema = this.createSchema({
        schema: this.endpoint.get("schema"),
        type: isPromise(type) || isArrayOrArrayClass(type) || type === Object ? undefined! : type,
        collectionType
      });
    }

    if (headers) {
      response.headers = Object.entries(headers).reduce((obj, [key, {value, ...schema}]: any[]) => {
        return {
          ...obj,
          [key]: {
            ...schema
          }
        };
      }, {});
    }

    return response;
  }
}
