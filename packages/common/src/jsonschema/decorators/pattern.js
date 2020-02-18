"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decoratorSchemaFactory_1 = require("../utils/decoratorSchemaFactory");
/**
 * The pattern and Pattern Properties keywords use regular expressions to express constraints.
 * The regular expression syntax used is from JavaScript (ECMA 262, specifically). However, that complete syntax is not widely supported, therefore it is recommended that you stick to the subset of that syntax described below.
 *
 * A single unicode character (other than the special characters below) matches itself.
 *
 * * `^`: Matches only at the beginning of the string.
 * * `$`: Matches only at the end of the string.
 * * `(...)`: Group a series of regular expressions into a single regular expression.
 * * `|`: Matches either the regular expression preceding or following the | symbol.
 * * `[abc]`: Matches any of the characters inside the square brackets.
 * * `[a-z]`: Matches the range of characters.
 * * `[^abc]`: Matches any character not listed.
 * * `[^a-z]`: Matches any character outside of the range.
 * * `+`: Matches one or more repetitions of the preceding regular expression.
 * * `*`: Matches zero or more repetitions of the preceding regular expression.
 * * `?`: Matches zero or one repetitions of the preceding regular expression.
 * * `+?`, *?`, ??`: The `*`, `+`, and `?` qualifiers are all greedy; they match as much text as possible. Sometimes this behavior isn’t desired and you want to match as few characters as possible.
 * * `{x}`: Match exactly x occurrences of the preceding regular expression.
 * * `{x,y}`: Match at least x and at most y occurrences of the preceding regular expression.
 * * `{x,}`: Match x occurrences or more of the preceding regular expression.
 * * `{x}?`, {x,y}?, {x,}?`: Lazy versions of the above expressions.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @Pattern("^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$")
 *    @Pattern(/^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$/)
 *    property: string;
 * }
 * ```
 *
 * ### With primitive type
 *
 * ```typescript
 * class Model {
 *    @Pattern(/^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$/)
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
 *       "pattern": "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
 *     }
 *   }
 * }
 * ```
 *
 * ### With array type
 *
 * ```typescript
 * class Model {
 *    @PropertyType(string)
 *    @Pattern(/^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$/)
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
 *         "type": "string",
 *         "pattern": "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param {string} pattern
 * @returns {Function}
 * @decorator
 * @ajv
 * @jsonschema
 * @property
 * @auto-map The data will be stored on the right place according to the type and collectionType (primitive or collection).
 */
function Pattern(pattern) {
    return decoratorSchemaFactory_1.decoratorSchemaFactory(schema => {
        if (typeof pattern === "object") {
            pattern = pattern.toString().slice(1, -1);
        }
        schema.mapper.pattern = pattern;
    });
}
exports.Pattern = Pattern;
//# sourceMappingURL=pattern.js.map