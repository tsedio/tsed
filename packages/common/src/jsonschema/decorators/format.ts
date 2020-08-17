import {Format as F} from "@tsed/schema";

/**
 * The following formats are supported for string validation with `format` keyword:
 *
 * - **date**: full-date according to [RFC3339](https://json-schema.org/latest/json-schema-validation.html#RFC3339).
 * - **time**: time with optional time-zone.
 * - **date-time**: date-time from the same source (time-zone is mandatory).
 * - **uri**: full uri with optional protocol.
 * - **email**: email address.
 * - **hostname**: host name according to [RFC1034](https://tools.ietf.org/html/rfc1034#section-3.1).
 * - **ipv4**: IP address v4.
 * - **ipv6**: IP address v6.
 * - **regex**: tests whether a string is a valid regular expression by passing it to RegExp constructor.
 *
 * ::: warning
 * This decorator will be removed in v7.
 * For v6 user, use @@Format@@ from @tsed/schema instead of @tsed/common.
 * :::
 *
 * ## Example
 * ### With primitive type
 *
 * ```typescript
 * class Model {
 *    @Format("email")
 *    property: string;
 * }
 * ```
 *
 * ```json
 * {
 *   "type": "object",
 *   "properties": {
 *     "property": {
 *       "type": "string",
 *       "format": "email"
 *     }
 *   }
 * }
 * ```
 *
 * ### With array type
 *
 * ```typescript
 * class Model {
 *    @Format("email")
 *    @CollectionOf(String)
 *    property: string[];
 * }
 * ```
 *
 * Will produce:
 *
 * ```json
 * {
 *   "type": "object",
 *   "properties": {
 *     "property": {
 *       "type": "array",
 *       "items": {
 *          "type": "string",
 *          "format": "email"
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param {string} format
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 * @ignore
 * @deprecated Use @Format decorator from @tsed/schema instead of.
 */
export function Format(format: string) {
  return F(format);
}
