import {OS3Header} from "@tsed/openspec";

/**
 * Represents an HTTP header in JSON schema format, compatible with OpenAPI Specification 3.
 *
 * This interface extends the OpenAPI 3 header specification, allowing full compatibility
 * with OpenAPI header definitions while providing JSON schema integration.
 *
 * @public
 */
export interface JsonHeader extends OS3Header {}

/**
 * Collection of HTTP headers for OpenAPI operations.
 *
 * Headers can be defined as simple values (number or string) or as detailed header
 * objects with schema information. This flexible structure supports both quick
 * header definitions and comprehensive OpenAPI header specifications.
 *
 * ### Usage
 *
 * ```typescript
 * const headers: JsonHeaders = {
 *   // Simple header value
 *   "X-Rate-Limit": 100,
 *
 *   // Detailed header with schema
 *   "X-Request-ID": {
 *     description: "Unique request identifier",
 *     type: "string",
 *     value: "abc-123"
 *   }
 * };
 * ```
 *
 * @public
 */
export interface JsonHeaders {
  [key: string]: number | string | (JsonHeader & {type?: string; value?: string | number});
}
