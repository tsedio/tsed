import {useDecorators} from "@tsed/core";
import {ParamTypes} from "../../models/ParamTypes";
import {UseParam} from "./useParam";

/**
 * RawBodyParams return the value from [request.body](http://expressjs.com/en/4x/api.html#req.body) as a Buffer.
 *
 * #### Example
 *
 * ```typescript
 * @Controller('/')
 * class MyCtrl {
 *    @Post('/')
 *    create(@RawBodyParams() body: Buffer) {
 *       console.log('Entire body', body.toString('utf8'));
 *    }
 * }
 * ```
 *
 * @decorator
 * @operation
 * @input
 */
export function RawBodyParams(): ParameterDecorator {
  return useDecorators(
    UseParam(ParamTypes.RAW_BODY, {
      useType: Object,
      useConverter: false,
      useValidation: false
    })
  );
}
