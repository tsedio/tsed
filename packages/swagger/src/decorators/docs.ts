import {StoreMerge} from "@tsed/core";

/**
 * Set the type documentation for this class.
 *
 * See [swagger documentation](/tutorials/swagger.html)
 *
 * @decorator
 * @swagger
 * @param docs
 */
export function Docs(...docs: string[]) {
  return StoreMerge("docs", docs);
}
