import {JsonResponse} from "../../domain/JsonResponse";
import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer";

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

registerJsonSchemaMapper("operationResponse", operationResponseMapper);
