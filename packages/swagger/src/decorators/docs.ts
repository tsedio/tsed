import {StoreMerge} from "@tsed/core";

/**
 *
 * @returns {Function}
 * @decorator
 * @swagger
 * @param docs
 */
export function Docs(...docs: string[]) {
  return StoreMerge("docs", docs);
}
