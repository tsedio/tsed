import {withErrorMsg} from "../../utils/withErrorMsg.js";
import {Allow} from "./allow.js";
import {Optional} from "./optional.js";

/**
 * Add required annotation on Property or Parameter.
 *
 * The @@Required@@ decorator can be used on two cases.
 *
 * To decorate a parameters:
 *
 * ```typescript
 * @Post("/")
 * async method(@Required() @BodyParams("field") field: string) {}
 * ```
 *
 * To decorate a model:
 *
 * ```typescript
 * class Model {
 *   @Required()
 *   field: string;
 * }
 * ```
 *
 * ::: tip
 * Required will throw a BadRequest when the given value is `null`, an empty string or `undefined`.
 * :::
 *
 * ### Allow values
 *
 * In some case, you didn't want trigger a BadRequest when the value is an empty string for example.
 * The decorator `@Allow()`, allow you to configure a value list for which there will be no exception.
 *
 * ```typescript
 * class Model {
 *   @Allow("") // add automatically required flag
 *   field: string;
 * }
 * ```
 *
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 */
export const Required = withErrorMsg("required", (required: boolean = true, ...allowedRequiredValues: any[]) => {
  return required ? Allow(...allowedRequiredValues) : Optional();
});
