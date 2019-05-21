import {StoreMerge} from "@tsed/core";
import {BaseParameter} from "swagger-schema-official";

/**
 *
 * @param {BaseParameter | any} baseParameter
 * @returns {Function}
 * @decorator
 * @swagger
 */
export function BaseParameter(baseParameter: BaseParameter | any) {
  return StoreMerge("baseParameter", baseParameter);
}
