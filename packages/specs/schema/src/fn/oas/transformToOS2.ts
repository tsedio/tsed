"use strict";
import {cleanObject} from "@tsed/core";
import {OpenSpec2, OpenSpec3, type OS2Security, OS3Operation} from "@tsed/openspec";

const HTTP_METHODS = ["get", "put", "post", "delete", "options", "head", "patch", "trace"];
const SCHEMA_PROPERTIES = [
  "format",
  "minimum",
  "maximum",
  "exclusiveMinimum",
  "exclusiveMaximum",
  "minLength",
  "maxLength",
  "multipleOf",
  "minItems",
  "maxItems",
  "uniqueItems",
  "minProperties",
  "maxProperties",
  "additionalProperties",
  "pattern",
  "enum",
  "default"
];
const ARRAY_PROPERTIES = ["type", "items"];

const APPLICATION_JSON_REGEX = /^(application\/json|[^;\/ \t]+\/[^;\/ \t]+[+]json)[ \t]*(;.*)?$/;
const SUPPORTED_MIME_TYPES: Record<string, any> = {
  APPLICATION_X_WWW_URLENCODED: "application/x-www-form-urlencoded",
  MULTIPART_FORM_DATA: "multipart/form-data"
};

function fixRef(ref: string) {
  return ref.replace("#/components/schemas/", "#/definitions/").replace("#/components/", "#/x-components/");
}

function fixRefs(obj: any) {
  if (Array.isArray(obj)) {
    obj.forEach(fixRefs);
  } else if (typeof obj === "object") {
    for (let key in obj) {
      if (key === "$ref") {
        obj.$ref = fixRef(obj.$ref);
      } else {
        fixRefs(obj[key]);
      }
    }
  }
}

function isJsonMimeType(type: string) {
  return new RegExp(APPLICATION_JSON_REGEX, "i").test(type);
}

function getSupportedMimeTypes(content: any) {
  const MIME_VALUES = Object.keys(SUPPORTED_MIME_TYPES).map((key) => {
    return SUPPORTED_MIME_TYPES[key];
  });
  return Object.keys(content).filter((key) => {
    return MIME_VALUES.indexOf(key) > -1 || isJsonMimeType(key);
  });
}

export function transformSecurity(securitySchemes: any) {
  function map(security: any): OS2Security | undefined {
    const {scheme, type, name, bearerFormat, flows, ...props} = security;

    switch (type) {
      case "http":
        if (scheme === "basic") {
          return {
            ...props,
            type: scheme
          };
        }

        if (scheme === "bearer") {
          return {
            ...props,
            type: "apiKey",
            name: "Authorization",
            in: "header"
          };
        }
        break;
      case "oauth2":
        const flowName = Object.keys(flows)[0];
        const flow = flows[flowName];
        let flowType = flowName;

        if (flowType === "clientCredentials") {
          flowType = "application";
        } else if (flowType === "authorizationCode") {
          flowType = "accessCode";
        }

        return {
          type,
          flow: flowType as never,
          authorizationUrl: flow.authorizationUrl,
          tokenUrl: flow.tokenUrl,
          scopes: flow.scopes
        };
    }
  }

  return Object.entries(securitySchemes).reduce(
    (securityDefinitions, [key, security]) => {
      const securityDefinition = map(security);

      if (securityDefinition) {
        securityDefinitions[key] = securityDefinition;
      }

      return securityDefinitions;
    },
    {} as Record<string, OS2Security>
  );
}

export function transformInformation(server: any) {
  let serverUrl = server.url;

  const variables = server["variables"] || {};

  for (const variable in variables) {
    const variableObject = variables[variable] || {};
    if (variableObject["default"]) {
      const re = RegExp(`{${variable}}`, "g");
      serverUrl = serverUrl.replace(re, variableObject["default"]);
    }
  }

  const url = new URL(serverUrl);

  return {
    host: url.host ? url.host : undefined,
    basePath: url.pathname,
    schemes: url.protocol !== null ? [url.protocol.substring(0, url.protocol.length - 1)] : undefined
  };
}

export class Converter {
  private spec: any;

  constructor(spec: Partial<OpenSpec3>) {
    this.spec = JSON.parse(JSON.stringify(spec));
  }

  convertInfos() {
    const server = this.spec.servers && this.spec.servers[0];

    if (server) {
      return transformInformation(server);
    }

    return {};
  }

  resolveReference(base: any, obj: any, shouldClone: boolean) {
    if (!obj || !obj.$ref) {
      return obj;
    }

    const ref: string = obj.$ref;

    if (ref.startsWith("#")) {
      const keys = ref.split("/").map((k) => k.replace(/~1/g, "/").replace(/~0/g, "~"));
      keys.shift();

      let cur = base;
      keys.forEach((k) => {
        cur = cur[k];
      });

      return shouldClone ? JSON.parse(JSON.stringify(cur)) : cur;
    }
  }

  convert() {
    const spec = {
      swagger: "2.0",
      ...this.convertInfos(),
      paths: this.spec.paths ? this.convertOperations(this.spec.paths, this.spec) : undefined
    };

    if (this.spec.components) {
      this.convertSchemas();
      this.convertSecurityDefinitions();

      this.spec["x-components"] = this.spec.components;
      delete this.spec.components;

      fixRefs(this.spec);
    }

    delete this.spec.servers;
    delete this.spec.openapi;
    delete this.spec["x-components"];

    return cleanObject({
      ...spec,
      ...this.spec
    });
  }

  convertOperations(paths: any, spec: any) {
    return Object.entries(paths).reduce((paths, [path, operation]) => {
      const pathObject = (paths[path] = this.resolveReference({...spec, paths}, operation, true));

      this.convertParameters(pathObject); // converts common parameters

      Object.keys(pathObject).forEach((method) => {
        if (HTTP_METHODS.indexOf(method) >= 0) {
          const operation = (pathObject[method] = this.resolveReference({...spec, paths}, pathObject[method], true));

          this.convertOperationParameters(operation);
          this.convertResponses(operation);
        }
      });

      return paths;
    }, paths);
  }

  convertOperationParameters(operation: OS3Operation) {
    let content, contentKey, mediaRanges, mediaTypes;
    operation.parameters = operation.parameters || [];

    if (operation.requestBody) {
      let param = this.resolveReference(this.spec, operation.requestBody, true);

      // fixing external $ref in body
      if (operation.requestBody.content) {
        const type = getSupportedMimeTypes(operation.requestBody.content)[0];
        const structuredObj: any = {content: {}};
        const data = operation.requestBody.content[type];

        if (data && data.schema && data.schema.$ref && !data.schema.$ref.startsWith("#")) {
          param = this.resolveReference(this.spec, data.schema, true);
          structuredObj["content"][`${type}`] = {schema: param};
          param = structuredObj;
        }
      }

      param.name = "body";
      content = param.content;

      if (content && Object.keys(content).length) {
        mediaRanges = Object.keys(content).filter((mediaRange) => mediaRange.indexOf("/") > 0);
        mediaTypes = mediaRanges.filter((range) => range.indexOf("*") < 0);
        contentKey = getSupportedMimeTypes(content)[0];

        delete param.content;

        if ([SUPPORTED_MIME_TYPES.APPLICATION_X_WWW_URLENCODED, SUPPORTED_MIME_TYPES.MULTIPART_FORM_DATA].includes(contentKey)) {
          (operation as any).consumes = mediaTypes;

          param.in = "formData";
          param.schema = content[contentKey].schema;
          param.schema = this.resolveReference(this.spec, param.schema, true);

          if (param.schema.type === "object" && param.schema.properties) {
            const required = param.schema.required || [];

            Object.keys(param.schema.properties).forEach((name) => {
              const schema = param.schema.properties[name];

              // readOnly properties should not be sent in requests
              if (!schema.readOnly) {
                const formDataParam: any = {
                  name,
                  in: "formData",
                  schema
                };
                if (required.indexOf(name) >= 0) {
                  formDataParam.required = true;
                }

                operation.parameters?.push(formDataParam);
              }
            });
          } else {
            operation.parameters.push(param);
          }
        } else if (contentKey) {
          (operation as any).consumes = mediaTypes;
          param.in = "body";
          param.schema = content[contentKey].schema;
          operation.parameters.push(param);
        } else if (mediaRanges) {
          (operation as any).consumes = mediaTypes || ["application/octet-stream"];
          param.in = "body";
          param.name = param.name || "file";
          delete param.type;

          param.schema = content[mediaRanges[0]].schema || {
            type: "string",
            format: "binary"
          };

          operation.parameters.push(param);
        }

        if (param.schema) {
          this.convertSchema(param.schema, "request");
        }
      }

      delete operation.requestBody;
    }
    this.convertParameters(operation);
  }

  convertParameters(obj: any) {
    if (obj.parameters === undefined) {
      return;
    }

    obj.parameters = obj.parameters || [];

    (obj.parameters || []).forEach((param: any, i: number) => {
      param = obj.parameters[i] = this.resolveReference(this.spec, param, false);

      if (param.in !== "body") {
        this.copySchemaProperties(param, SCHEMA_PROPERTIES);
        this.copySchemaProperties(param, ARRAY_PROPERTIES);
        this.copySchemaXProperties(param);

        if (!param.description) {
          const schema = this.resolveReference(this.spec, param.schema, false);
          if (!!schema && schema.description) {
            param.description = schema.description;
          }
        }

        if (param.example !== undefined) {
          param["x-example"] = param.example;
        }

        delete param.schema;
        delete param.allowReserved;
        delete param.example;
      }

      if (param.type === "array") {
        let style = param.style || (param.in === "query" || param.in === "cookie" ? "form" : "simple");

        switch (style) {
          case "matrix":
            param.collectionFormat = param.explode ? undefined : "csv";
            break;
          case "label":
            param.collectionFormat = undefined;
            break;
          case "simple":
            param.collectionFormat = "csv";
            break;
          case "spaceDelimited":
            param.collectionFormat = "ssv";
            break;
          case "pipeDelimited":
            param.collectionFormat = "pipes";
            break;
          case "deepOpbject":
            param.collectionFormat = "multi";
            break;
          case "form":
            param.collectionFormat = param.explode === false ? "csv" : "multi";
            break;
        }
      }

      delete param.style;
      delete param.explode;
    });
  }

  copySchemaProperties(obj: any, props: any[]) {
    let schema = this.resolveReference(this.spec, obj.schema, true);

    if (!schema) {
      return;
    }

    props.forEach((prop) => {
      const value = schema[prop];

      if (prop === "additionalProperties" && typeof value === "boolean") {
        return;
      }

      if (value !== undefined) {
        obj[prop] = value;
      }
    });
  }

  copySchemaXProperties(obj: Record<string, any>) {
    let schema = this.resolveReference(this.spec, obj.schema, true);
    if (!schema) {
      return;
    }

    Object.keys(schema).forEach((propName) => {
      if (Reflect.hasOwnProperty.call(schema, propName) && !Reflect.hasOwnProperty.call(obj, propName) && propName.startsWith("x-")) {
        obj[propName] = schema[propName];
      }
    });
  }

  convertResponses(operation: Record<string, any>) {
    // var anySchema, code, content, jsonSchema, mediaRange, mediaType, response, resolved, headers

    Object.keys(operation.responses || {}).forEach((code) => {
      const response = (operation.responses[code] = this.resolveReference(this.spec, operation.responses[code], true));

      if (response.content) {
        let anySchema: any = null;
        let jsonSchema: any = null;

        Object.keys(response.content).forEach((mediaRange) => {
          // produces and examples only allow media types, not ranges
          // use application/octet-stream as a catch-all type
          const mediaType = mediaRange.indexOf("*") < 0 ? mediaRange : "application/octet-stream";

          if (!operation.produces) {
            operation.produces = [mediaType];
          } else if (operation.produces.indexOf(mediaType) < 0) {
            operation.produces.push(mediaType);
          }

          const content = response.content[mediaRange];
          anySchema = anySchema || content.schema;

          if (!jsonSchema && isJsonMimeType(mediaType)) {
            jsonSchema = content.schema;
          }

          if (content.example) {
            response.examples = response.examples || {};
            response.examples[mediaType] = content.example;
          }
        });

        if (anySchema) {
          response.schema = jsonSchema || anySchema;
          const resolved = this.resolveReference(this.spec, response.schema, true);

          if (resolved && response.schema.$ref && !response.schema.$ref.startsWith("#")) {
            response.schema = resolved;
          }

          this.convertSchema(response.schema, "response");
        }
      }

      Object.keys(response.headers || {}).forEach((header) => {
        // Always resolve headers when converting to v2.
        const resolved = this.resolveReference(this.spec, response.headers[header], true);

        // Headers should be converted like parameters.
        if (resolved.schema) {
          resolved.type = resolved.schema.type;
          resolved.format = resolved.schema.format;
          delete resolved.schema;
        }

        response.headers[header] = resolved;
      });

      delete response.content;
    });
  }

  convertSchema(def: any, operationDirection?: any) {
    if (def.oneOf) {
      delete def.oneOf;

      if (def.discriminator) {
        delete def.discriminator;
      }
    }

    if (def.anyOf) {
      delete def.anyOf;

      if (def.discriminator) {
        delete def.discriminator;
      }
    }

    if (def.allOf) {
      for (const i in def.allOf) {
        this.convertSchema(def.allOf[i], operationDirection);
      }
    }

    if (def.discriminator) {
      if (def.discriminator.mapping) {
        this.convertDiscriminatorMapping(def.discriminator.mapping);
      }

      def.discriminator = def.discriminator.propertyName;
    }

    switch (def.type) {
      case "object":
        if (def.properties) {
          Object.keys(def.properties).forEach((propName) => {
            if (def.properties[propName].writeOnly === true && operationDirection === "response") {
              delete def.properties[propName];
            } else {
              this.convertSchema(def.properties[propName], operationDirection);
              delete def.properties[propName].writeOnly;
            }
          });
        }
        break;
      case "array":
        if (def.items) {
          this.convertSchema(def.items, operationDirection);
        }
    }

    if (def.nullable) {
      def["x-nullable"] = true;
      delete def.nullable;
    }

    // OpenAPI 3 has boolean "deprecated" on Schema, OpenAPI 2 does not
    // Convert to x-deprecated for Autorest (and perhaps others)
    if (def["deprecated"] !== undefined) {
      // Move to x-deprecated, unless it is already defined
      if (def["x-deprecated"] === undefined) {
        def["x-deprecated"] = def.deprecated;
      }
      delete def.deprecated;
    }
  }

  convertSchemas() {
    this.spec.definitions = this.spec.components.schemas;

    Object.keys(this.spec.definitions || {}).forEach((defName) => {
      this.convertSchema(this.spec.definitions[defName]);
    });

    delete this.spec.components.schemas;
  }

  convertDiscriminatorMapping(mapping: any) {
    Object.keys(mapping).forEach((payload) => {
      const schemaNameOrRef = mapping[payload];

      if (typeof schemaNameOrRef !== "string") {
        console.warn(`Ignoring ${schemaNameOrRef} for ${payload} in discriminator.mapping.`);
        return;
      }

      // payload may be a schema name or JSON Reference string.
      // OAS3 spec limits schema names to ^[a-zA-Z0-9._-]+$
      // Note: Valid schema name could be JSON file name without extension.
      //       Prefer schema name, with file name as fallback.
      let schema;
      if (/^[a-zA-Z0-9._-]+$/.test(schemaNameOrRef)) {
        try {
          schema = this.resolveReference(this.spec, {$ref: `#/components/schemas/${schemaNameOrRef}`}, false);
        } catch (err) {
          console.debug(`Error resolving ${schemaNameOrRef} for ${payload} as schema name in discriminator.mapping: ${err}`);
        }
      }

      // schemaNameRef is not a schema name.  Try to resolve as JSON Ref.
      if (!schema) {
        try {
          schema = this.resolveReference(this.spec, {$ref: schemaNameOrRef}, false);
        } catch (err) {
          console.debug(`Error resolving ${schemaNameOrRef} for ${payload} in discriminator.mapping: ${err}`);
        }
      }

      if (schema) {
        // Swagger Codegen + OpenAPI Generator extension
        // https://github.com/swagger-api/swagger-codegen/pull/4252
        schema["x-discriminator-value"] = payload;

        // AutoRest extension
        // https://github.com/Azure/autorest/pull/474
        schema["x-ms-discriminator-value"] = payload;
      } else {
        console.warn(`Unable to resolve ${schemaNameOrRef} for ${payload} in discriminator.mapping.`);
      }
    });
  }

  convertSecurityDefinitions() {
    if (this.spec.components.securitySchemes) {
      this.spec.securityDefinitions = transformSecurity(this.spec.components.securitySchemes);
      delete this.spec.components.securitySchemes;
    }
  }
}

export function transformToOS2(spec: any): Partial<OpenSpec2> {
  return new Converter(spec).convert();
}
