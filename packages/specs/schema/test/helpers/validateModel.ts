import {Ajv, Options} from "ajv";
import AjvErrors from "ajv-errors";
import AjvFormats from "ajv-formats";

import type {JsonSchemaOptions} from "../../src/index.js";
import {getJsonSchema} from "../../src/index.js";

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
  // @ts-ignore
  AjvErrors(ajv);

  // @ts-ignore
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
