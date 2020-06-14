import {cleanObject, deepMerge} from "@tsed/core";
import {IResponseOptions} from "../../interfaces/IResponseOptions";
import {EndpointFn} from "./endpointFn";

const isSuccessStatus = (code: number | undefined) => code && 200 <= code && code < 300;

/**
 * Define the returned type for the serialization.
 *
 * ```typescript
 * @Controller('/')
 * export class Ctrl {
 *    @Get('/')
 *    @ReturnType({code: 200, type: User, collectionType: Map})
 *    get(): Promise<Map<User>> { }
 * }
 *
 * ```
 *
 * @returns {Function}
 * @param response
 * @decorator
 * @endpoint
 */
export function ReturnType(response: Partial<IResponseOptions> = {}): Function {
  return EndpointFn(endpoint => {
    const {responses, statusCode} = endpoint;
    const code = response.code || statusCode; // implicit

    if (isSuccessStatus(response.code)) {
      const {response} = endpoint;
      responses.delete(statusCode);
      endpoint.statusCode = code;
      endpoint.responses.set(code, response);
    }

    response = {
      description: "",
      ...deepMerge(endpoint.responses.get(code), cleanObject(response)),
      code
    };

    endpoint.responses.set(response.code!, response as IResponseOptions);
  });
}
