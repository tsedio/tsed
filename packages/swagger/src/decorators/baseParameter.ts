import {StoreMerge} from "@tsed/core";
import {BaseParameter} from "swagger-schema-official";

/**
 *
 * @param {BaseParameter | any} baseParameter
 * @decorator
 * @swagger
 * @input
 * @ignore
 * @deprecated Will be removed in v6
 */
export function BaseParameter(baseParameter: BaseParameter | any) {
  return StoreMerge("baseParameter", baseParameter);
}
