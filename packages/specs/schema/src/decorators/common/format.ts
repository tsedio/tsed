import {ValueOf} from "@tsed/core";

import {JsonFormatTypes} from "../../domain/JsonFormatTypes.js";
import {withErrorMsg} from "../../utils/withErrorMsg.js";
import {JsonEntityFn} from "./jsonEntityFn.js";

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
 * For v6 user, use @@Format@@ from @tsed/schema instead of @tsed/platform-http.
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
 * @ajv-errors
 */
export const Format = withErrorMsg("format", (format: JsonFormatTypes | ValueOf<JsonFormatTypes>) => {
  return JsonEntityFn((store) => {
    store.itemSchema.format(format);
  });
});

/**
 * Apply an email validation on property.
 *
 * ::: warning
 * For v6 user, use @@Email@@ from @tsed/schema instead of @tsed/platform-http.
 * :::
 *
 * ## Example
 * ### With primitive type
 *
 * ```typescript
 * class Model {
 *    @Email()
 *    property: string;
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
 *    @Email()
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
 * @returns {Function}
 * @decorator
 * @validation
 * @schema
 * @swagger
 * @input
 * @ajv-errors
 */
export const Email = withErrorMsg("format", () => {
  return Format(JsonFormatTypes.EMAIL);
});

/**
 * Apply a date-time validation on property.
 *
 * ## Example
 * ### With primitive type
 *
 * ```typescript
 * class Model {
 *    @DateTime()
 *    property: string;
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
 *       "type": "string",
 *       "format": "date-time"
 *     }
 *   }
 * }
 * ```
 *
 * ### With array type
 *
 * ```typescript
 * class Model {
 *    @DateTime()
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
 *          "format": "date-time"
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @validation
 * @property
 * @parameter
 * @schema
 * @auto-map The data will be stored on the right place according to the type and collectionType (primitive or collection).
 * @ajv-errors
 */
export const DateTime = withErrorMsg("format", () => {
  return Format(JsonFormatTypes.DATE_TIME);
});

/**
 * Apply a time validation on property.
 *
 * ## Example
 * ### With primitive type
 *
 * ```typescript
 * class Model {
 *    @Time()
 *    property: string;
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
 *       "type": "string",
 *       "format": "time"
 *     }
 *   }
 * }
 * ```
 *
 * ### With array type
 *
 * ```typescript
 * class Model {
 *    @Time()
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
 *          "format": "time"
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @validation
 * @property
 * @parameter
 * @schema
 * @ajv-errors
 */
export const DateFormat = withErrorMsg("format", () => {
  return Format(JsonFormatTypes.DATE);
});

/**
 * Apply a time validation on property.
 *
 * ## Example
 * ### With primitive type
 *
 * ```typescript
 * class Model {
 *    @TimeFormat()
 *    property: string;
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
 *       "type": "string",
 *       "format": "time"
 *     }
 *   }
 * }
 * ```
 *
 * ### With array type
 *
 * ```typescript
 * class Model {
 *    @TimeFormat()
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
 *          "format": "time"
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @validation
 * @property
 * @parameter
 * @schema
 * @ajv-errors
 */
export const TimeFormat = withErrorMsg("format", () => {
  return Format(JsonFormatTypes.TIME);
});

/**
 * Apply a uri validation on property.
 *
 * ## Example
 * ### With primitive type
 *
 * ```typescript
 * class Model {
 *    @Uri()
 *    property: string;
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
 *       "type": "string",
 *       "format": "uri"
 *     }
 *   }
 * }
 * ```
 *
 * ### With array type
 *
 * ```typescript
 * class Model {
 *    @Uri()
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
 *          "format": "uri"
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @validation
 * @property
 * @parameter
 * @schema
 * @ajv-errors
 */
export const Uri = withErrorMsg("format", () => {
  return Format(JsonFormatTypes.URI);
});

/**
 * Apply a url validation on property.
 *
 * ## Example
 * ### With primitive type
 *
 * ```typescript
 * class Model {
 *    @Url()
 *    property: string;
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
 *       "type": "string",
 *       "format": "url"
 *     }
 *   }
 * }
 * ```
 *
 * ### With array type
 *
 * ```typescript
 * class Model {
 *    @Url()
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
 *          "format": "url"
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @validation
 * @property
 * @parameter
 * @schema
 * @ajv-errors
 */
export const Url = withErrorMsg("format", () => {
  return Format(JsonFormatTypes.URL);
});
