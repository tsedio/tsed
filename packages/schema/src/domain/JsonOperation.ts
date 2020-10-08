import {deepExtends, uniq, uniqBy} from "@tsed/core";
import {OpenSpecTag, OS3Operation} from "@tsed/openspec";
import {OpenSpecSecurity} from "../../../openspec/src/common/OpenSpecSecurity";
import {HTTP_STATUS_MESSAGES} from "../constants/httpStatusMessages";
import {JsonHeader, JsonSchemaOptions} from "../interfaces";
import {isSuccessStatus} from "../utils/isSuccessStatus";
import {JsonMap} from "./JsonMap";
import {JsonParameter} from "./JsonParameter";
import {isParameterType, JsonParameterTypes} from "./JsonParameterTypes";
import {JsonRequestBody} from "./JsonRequestBody";
import {JsonResponse} from "./JsonResponse";
import {JsonSchema} from "./JsonSchema";
import {SpecTypes} from "./SpecTypes";

export interface JsonMethodPath {
  path: string | RegExp;
  method: string;

  [key: string]: any;
}

export interface JsonOperationOptions extends OS3Operation<JsonSchema, JsonParameter, JsonMap<JsonResponse>> {
  consumes: string[];
  produces: string[];
}

export class JsonOperation extends JsonMap<JsonOperationOptions> {
  readonly operationPaths: Map<string, JsonMethodPath> = new Map();
  private _status: number;

  constructor(obj: Partial<JsonOperationOptions> = {}) {
    super({parameters: [], responses: new JsonMap(), ...obj});
  }

  get response(): JsonResponse | undefined {
    return this.getResponses().get(this.getStatus().toString());
  }

  get status() {
    return this._status;
  }

  tags(tags: OpenSpecTag[]): this {
    super.set("tags", tags);

    return this;
  }

  addTags(tags: OpenSpecTag[]) {
    tags = uniqBy([...(this.get("tags") || []), ...tags], "name");

    return this.tags(tags);
  }

  summary(summary: string): this {
    super.set("summary", summary);

    return this;
  }

  operationId(operationId: string): this {
    this.set("operationId", operationId);

    return this;
  }

  responses(responses: JsonMap<any>): this {
    this.set("responses", responses);

    return this;
  }

  defaultStatus(status: number) {
    this._status = status;
  }

  getStatus() {
    return this._status || 200;
  }

  addResponse(statusCode: string | number, response: JsonResponse) {
    if (isSuccessStatus(statusCode) && !this._status) {
      const res = this.getResponseOf(200);

      this.getResponses().set(statusCode.toString(), res).delete("200");

      this.defaultStatus(Number(statusCode));
    }

    const currentCode = statusCode === "default" ? this.getStatus().toString() : statusCode.toString();
    const currentResponse = this.getResponses().get(currentCode);

    if (!currentResponse) {
      this.getResponses().set(currentCode, response);
    } else {
      response.forEach((value, key) => {
        if (!["content"].includes(key)) {
          currentResponse.set(key, deepExtends(currentResponse.get(key), value));
        }
      });
    }

    return this;
  }

  getResponses() {
    return this.get("responses") as JsonMap<JsonResponse>;
  }

  getResponseOf(status: number | string): JsonResponse {
    return (status === "default" ? this.response : this.getResponses().get(String(status))) || new JsonResponse();
  }

  getHeadersOf(status: number): { [key: string]: JsonHeader } {
    return this.getResponseOf(status).get("headers") || {};
  }

  getContentTypeOf(status: number): any {
    return [...this.getResponseOf(status).get("content").keys()][0];
  }

  security(security: OpenSpecSecurity): this {
    this.set("security", security);

    return this;
  }

  addSecurityScopes(name: string, scopes: string[]) {
    const security = this.get("security") || {};
    security[name] = uniq([...(security[name] || []), ...scopes]);

    return this.security(security);
  }

  description(description: string): this {
    super.set("description", description);

    return this;
  }

  deprecated(deprecated: boolean): this {
    super.set("deprecated", deprecated);

    return this;
  }

  parameters(parameters: JsonParameter[]): this {
    super.set("parameters", parameters);

    return this;
  }

  addParameter(index: number, parameter: JsonParameter) {
    if (index === -1) {
      index = this.get("parameters").length;
    }
    this.get("parameters")[index] = parameter;
  }

  consumes(consumes: string[]): this {
    super.set("consumes", consumes);

    return this;
  }

  produces(produces: string[]): this {
    super.set("produces", produces);

    return this;
  }

  addProduce(produce: string) {
    const produces = uniq([].concat(this.get("produces"), produce as never)).filter(Boolean);

    this.set("produces", produces);
  }

  addOperationPath(method: string, path: string | RegExp, options: any = {}) {
    this.operationPaths.set(String(method) + String(path), {
      ...options,
      method,
      path
    });

    return this;
  }

  toJSON(options: JsonSchemaOptions = {}): any {
    const operation = super.toJSON(options);
    const bodyParameters: JsonParameter[] = [];
    const parameters: any[] = [];

    this.get("parameters").forEach((parameter: JsonParameter) => {
      if (!isParameterType(this.get("in"))) {
        if (parameter.get("in")) {
          if (parameter.get("in") === JsonParameterTypes.BODY) {
            bodyParameters.push(parameter);
          } else {
            parameters.push(...[].concat(parameter.toJSON(options)));
          }
        }
      }
    });

    operation.parameters = parameters.filter(Boolean);

    if (this.get("responses").size === 0) {
      operation.responses = {
        "200": {
          description: HTTP_STATUS_MESSAGES[200]
        }
      };
    }

    if (bodyParameters.length) {
      const parameter = buildSchemaFromBodyParameters(bodyParameters);
      if (options.spec === SpecTypes.OPENAPI) {
        operation.requestBody = toRequestBody(this, parameter).toJSON(options);
      } else {
        operation.parameters.push(toJsonParameter(parameter).toJSON(options));
      }
    }

    if (options.spec === SpecTypes.OPENAPI) {
      delete operation.consumes;
      delete operation.produces;
    }

    return operation;
  }
}

function toRequestBody(operation: JsonOperation, {schema, ...props}: any) {
  const requestBody = new JsonRequestBody(props);

  const consumes = operation.get("consumes")?.length ? operation.get("consumes") : ["application/json"];

  consumes.forEach((consume: string) => {
    requestBody.addContent(consume, schema);
  });

  return requestBody;
}

function toJsonParameter(parameter: any) {
  return new JsonParameter({
    in: JsonParameterTypes.BODY,
    name: JsonParameterTypes.BODY,
    ...parameter
  });
}

function buildSchemaFromBodyParameters(parameters: JsonParameter[]) {
  let schema = new JsonSchema();
  const props: any = {};
  const refs: JsonSchema[] = [];
  let propsLength = 0;

  parameters.forEach((parameter) => {
    const name = parameter.get("name");

    Array.from(parameter.entries())
      .filter(([key]) => !["in", "name"].includes(key))
      .forEach(([key, value]) => {
        if (props[key] === undefined) {
          props[key] = value;
        }
      });

    if (name) {
      schema.addProperties(name, parameter.$schema as JsonSchema);

      if (parameter.get("required")) {
        schema.addRequired(name);
      }

      propsLength++;
    } else {
      refs.push(parameter.$schema);
    }
  });

  if (propsLength) {
    schema.type("object");
  } else if (refs.length === 1) {
    schema = refs[0];
  }

  if (refs.length >= 2) {
    schema.allOf(refs);
  }

  return {schema, required: false, ...props};
}
