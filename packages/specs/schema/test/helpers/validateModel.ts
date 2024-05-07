import {getJsonSchema} from "../../src";
import Ajv, {Options} from "ajv";
import AjvFormats from "ajv-formats";
import AjvErrors from "ajv-errors";
import type {JsonSchemaOptions} from "../../src";

export function validateModel(data: any, model: any, options: JsonSchemaOptions & Options = {}) {
  const {errorFormatter, keywords = [], ...props} = options;
  const opts: Options = {
    verbose: false,
    coerceTypes: true,
    strict: false,
    keywords,
    discriminator: true,
    allErrors: true,
    ...props
  };

  const ajv = new Ajv(opts);

  // add support for custom error messages
  AjvErrors(ajv);

  AjvFormats(ajv as any);

  const schema = getJsonSchema(model, {
    ...options,
    customKeys: true
  });

  const result = ajv.validate(schema, data);

  if (!result) {
    return ajv.errors;
  }

  return true;
}
