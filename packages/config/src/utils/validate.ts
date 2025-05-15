import {AjvService} from "@tsed/ajv";
import {inject} from "@tsed/di";
import {JsonSchema} from "@tsed/schema";

export async function validate(configName: string, config: Record<string, unknown>, validationSchema: JsonSchema) {
  const ajv = inject(AjvService);

  try {
    return await ajv.validate(config, {
      returnsCoercedValues: true,
      schema: validationSchema.toJSON()
    });
  } catch (er) {
    er.message = er.message.replace("Value.", `extends[${configName}].`);

    throw er;
  }
}
