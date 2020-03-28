import {uniq, uniqBy} from "@tsed/core";
import {JsonExternalDocumentation, JsonSecurityRequirement, JsonSerializerOptions, JsonTag} from "../interfaces";
import {JsonMap} from "./JsonMap";
import {JsonParameter} from "./JsonParameter";
import {JsonParameterTypes} from "./JsonParameterTypes";
import {JsonRequestBody} from "./JsonRequestBody";
import {JsonResponse} from "./JsonResponse";
import {JsonSchema} from "./JsonSchema";
import {SpecTypes} from "./SpecTypes";

export interface JsonMethodPath {
  path: string | RegExp;
  method: string;
}

export interface JsonOperationOptions {
  tags: string[];
  summary: string;
  description: string;
  consumes: string[];
  produces: string[];
  operationId: string;
  parameters: JsonParameter[];
  deprecated: boolean;
  security?: JsonSecurityRequirement[];
  responses: any;
  externalDocs: JsonExternalDocumentation;
  // callbacks?: {[callback: string]: ReferenceObject | CallbackObject};
  // servers?: ServerObject[];
}

export class JsonOperation extends JsonMap<JsonOperationOptions> {
  readonly operationPaths: Map<string, JsonMethodPath> = new Map();
  private _status: Number;

  constructor(obj: Partial<JsonOperationOptions> = {}) {
    super({parameters: [], responses: new JsonMap(), ...obj});
  }

  tags(tags: JsonTag[]): this {
    super.set("tags", tags);

    return this;
  }

  addTags(tags: JsonTag[]) {
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
    this._status = this._status || status;
  }

  addResponse(statusCode: number, response: JsonResponse) {
    this.get("responses").set(statusCode, response);
  }

  security(security: JsonSecurityRequirement): this {
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

  addOperationPath(method: string, path: string | RegExp) {
    this.operationPaths.set(String(method) + String(path), {
      method,
      path
    });

    return this;
  }

  toJSON(options: JsonSerializerOptions = {}): any {
    const operation = super.toJSON(options);
    const bodyParameters: JsonParameter[] = [];
    const parameters: any[] = [];

    this.get("parameters").forEach((parameter: JsonParameter) => {
      if (parameter.get("in")) {
        if (parameter.get("in") === JsonParameterTypes.BODY) {
          bodyParameters.push(parameter);
        } else {
          parameters.push(parameter.toJSON(options));
        }
      }
    });

    operation.parameters = parameters;

    if (this.get("responses").size === 0) {
      operation.responses = {
        "200": {
          description: ""
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

  parameters.forEach(parameter => {
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
