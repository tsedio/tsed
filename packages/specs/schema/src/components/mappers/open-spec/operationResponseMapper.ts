import {JsonResponse} from "../../../domain/JsonResponse.js";
import {JsonSchemaOptions} from "../../../domain/JsonSchemaOptions.js";
import {defineSchemaMapper, execMapper} from "../../../registries/JsonSchemaMapperContainer.js";

export function operationResponseMapper(jsonResponse: JsonResponse, options: JsonSchemaOptions = {}) {
  const response = execMapper("map", [jsonResponse], options);

  if (jsonResponse.status === 204) {
    delete response.content;
  }

  if (response.headers) {
    Object.entries(response.headers).forEach(([key, {type, ...props}]: [string, any]) => {
      response.headers[key] = {
        ...props,
        schema: {
          type
        }
      };
    });
  }

  return response;
}

defineSchemaMapper({type: "operationResponse", transform: operationResponseMapper});
