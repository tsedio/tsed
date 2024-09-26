import type {JsonParameter} from "../../domain/JsonParameter.js";
import {JsonRequestBody} from "../../domain/JsonRequestBody.js";
import {JsonSchema} from "../../domain/JsonSchema.js";
import type {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";

function buildSchemaFromBodyParameters(parameters: JsonParameter[], options: JsonSchemaOptions) {
  let schema = new JsonSchema();
  const props: any = {};
  const refs: JsonSchema[] = [];
  let propsLength = 0;

  const hasFile = parameters.some((param) => param.get("in") === "files");

  parameters.forEach((parameter) => {
    const name = parameter.getName();

    [...parameter.entries()]
      .filter(([key]) => !["in", "name"].includes(key))
      .forEach(([key, value]) => {
        if (props[key] === undefined) {
          props[key] = value;
        }
      });

    const jsonParameter = execMapper("operationInParameter", [parameter], options);

    if (name) {
      const propSchema = {
        ...(jsonParameter.schema || {
          type: jsonParameter.type
        })
      };

      if (hasFile && jsonParameter.description) {
        propSchema.description = jsonParameter.description;
      }

      schema.addProperty(name, propSchema);

      if (parameter.get("required")) {
        schema.addRequired(name);
      }

      propsLength++;
    } else {
      refs.push(jsonParameter);
    }
  });

  if (!propsLength) {
    if (refs.length === 1) {
      return refs[0];
    }
  }

  schema.type("object");

  if (props.description && hasFile) {
    delete props.description;
  }

  return {
    schema: schema.toJSON(options),
    required: false,
    ...props
  };
}

export function operationRequestBodyMapper(bodyParameters: JsonParameter[], {consumes, ...options}: JsonSchemaOptions) {
  const {schema, examples, in: _, ...props} = buildSchemaFromBodyParameters(bodyParameters, options);

  const requestBody = new JsonRequestBody(props);

  consumes.forEach((consume: string) => {
    requestBody.addContent(consume, schema, examples);
  });

  return execMapper("map", [requestBody], options);
}

registerJsonSchemaMapper("operationRequestBody", operationRequestBodyMapper);
