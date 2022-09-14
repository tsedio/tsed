import {deepMerge, uniq, uniqBy} from "@tsed/core";
import {OpenSpecSecurity, OpenSpecTag, OS3Operation} from "@tsed/openspec";
import {getStatusMessage} from "../constants/httpStatusMessages";
import {JsonHeader} from "../interfaces/JsonOpenSpec";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions";
import {isRedirectionStatus, isSuccessStatus} from "../utils/isSuccessStatus";
import {JsonMap} from "./JsonMap";
import {JsonParameter} from "./JsonParameter";
import {isParameterType, JsonParameterTypes} from "./JsonParameterTypes";
import {JsonRequestBody} from "./JsonRequestBody";
import {JsonResponse} from "./JsonResponse";
import {JsonSchema} from "./JsonSchema";

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
  #status: number;
  #redirection: boolean = false;

  constructor(obj: Partial<JsonOperationOptions> = {}) {
    super({parameters: [], responses: new JsonMap(), ...obj});
  }

  get response(): JsonResponse | undefined {
    return this.getResponses().get(this.getStatus().toString());
  }

  get status() {
    return this.#status;
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
    this.#status = status;

    return this;
  }

  getStatus() {
    return this.#status || 200;
  }

  setRedirection(status = 302) {
    this.#redirection = true;
    this.#status = status;
    return this;
  }

  isRedirection(status?: number) {
    if (this.#redirection) {
      if (status) {
        return isRedirectionStatus(status);
      }
    }

    return this.#redirection;
  }

  addResponse(statusCode: string | number, response: JsonResponse) {
    if ((isSuccessStatus(statusCode) || isRedirectionStatus(statusCode)) && !this.#status) {
      const res = this.getResponseOf(200);

      this.getResponses().set(statusCode.toString(), res).delete("200");

      this.defaultStatus(Number(statusCode));
    }

    const currentCode = statusCode === "default" ? this.getStatus().toString() : statusCode.toString();
    const currentResponse = this.getResponses().get(currentCode);

    if (!currentResponse) {
      response.status = Number(currentCode);
      this.getResponses().set(currentCode, response);
    } else {
      response.forEach((value, key) => {
        if (!["content"].includes(key)) {
          currentResponse.set(key, deepMerge(currentResponse.get(key), value));
        }
      });
      currentResponse.status = Number(currentCode);
    }

    return this;
  }

  getResponses() {
    return this.get("responses") as JsonMap<JsonResponse>;
  }

  getResponseOf(status: number | string): JsonResponse {
    return (status === "default" ? this.response : this.getResponses().get(String(status))) || new JsonResponse();
  }

  ensureResponseOf(status: number | string): JsonResponse {
    this.addResponse(status, this.getResponseOf(status));
    return this.getResponseOf(status);
  }

  getHeadersOf(status: number): Record<string, JsonHeader & {example: string}> {
    return this.getResponseOf(status).get("headers") || {};
  }

  getContentTypeOf(status: number): any {
    return [...this.getResponseOf(status).get("content").keys()].slice(-1)[0];
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
    const operation = super.toJSON({...options, ignore: ["parameters"]});
    const bodyParameters: JsonParameter[] = [];
    const parameters: any[] = [];

    if (operation.security) {
      operation.security = [].concat(operation.security);
    }

    this.get("parameters").forEach((parameter: JsonParameter) => {
      if (!isParameterType(this.get("in"))) {
        if (parameter.get("in")) {
          if ([JsonParameterTypes.BODY, JsonParameterTypes.FILES].includes(parameter.get("in"))) {
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
          description: getStatusMessage(200)
        }
      };
    }

    if (bodyParameters.length) {
      const parameter = buildSchemaFromBodyParameters(bodyParameters, options);
      operation.requestBody = toRequestBody(this, parameter).toJSON(options);
    }

    delete operation.consumes;
    delete operation.produces;

    return operation;
  }
}

function toRequestBody(operation: JsonOperation, {schema, examples, in: _, ...props}: any) {
  const requestBody = new JsonRequestBody(props);

  const consumes = operation.get("consumes")?.length ? operation.get("consumes") : ["application/json"];

  consumes.forEach((consume: string) => {
    requestBody.addContent(consume, schema, examples);
  });

  return requestBody;
}

function buildSchemaFromBodyParameters(parameters: JsonParameter[], options: JsonSchemaOptions) {
  let schema = new JsonSchema();
  const props: any = {};
  const refs: JsonSchema[] = [];
  let propsLength = 0;

  parameters.forEach((parameter) => {
    const name = parameter.getName();

    Array.from(parameter.entries())
      .filter(([key]) => !["in", "name"].includes(key))
      .forEach(([key, value]) => {
        if (props[key] === undefined) {
          props[key] = value;
        }
      });

    const jsonParameter = parameter.toJSON(options);

    if (name) {
      schema.addProperty(
        name,
        jsonParameter.schema || {
          type: jsonParameter.type
        }
      );

      if (parameter.get("required")) {
        schema.addRequired(name);
      }

      propsLength++;
    } else {
      refs.push(jsonParameter);
    }
  });

  if (!propsLength) {
    if (refs.length === 1) {
      return refs[0];
    }
  }

  schema.type("object");

  return {schema: schema.toJSON(options), required: false, ...props};
}
