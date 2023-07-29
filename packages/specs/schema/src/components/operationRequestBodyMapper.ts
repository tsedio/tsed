import {JsonOperation} from "../domain/JsonOperation";
import {JsonParameter} from "../domain/JsonParameter";
import {isParameterType, JsonParameterTypes} from "../domain/JsonParameterTypes";
import {JsonRequestBody} from "../domain/JsonRequestBody";
import {JsonSchema} from "../domain/JsonSchema";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions";
import {execMapper, registerJsonSchemaMapper} from "../registries/JsonSchemaMapperContainer";

function buildSchemaFromBodyParameters(parameters: JsonParameter[], options: JsonSchemaOptions) {
  let schema = new JsonSchema();
  const props: any = {};
  const refs: JsonSchema[] = [];
  let propsLength = 0;

  parameters.forEach((parameter) => {
    const name = parameter.getName();

    [...parameter.entries()]
      .filter(([key]) => !["in", "name"].includes(key))
      .forEach(([key, value]) => {
        if (props[key] === undefined) {
          props[key] = value;
        }
      });

    const jsonParameter = execMapper("operationInParameter", parameter, options);

    if (name) {
      schema.addProperty(
        name,
        jsonParameter.schema || {
          type: jsonParameter.type
        }
      );

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

  return execMapper("map", requestBody, options);
}

registerJsonSchemaMapper("operationRequestBody", operationRequestBodyMapper);
