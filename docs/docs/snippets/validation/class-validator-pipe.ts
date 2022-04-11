import {ValidationError, ValidationPipe} from "@tsed/platform-params";
import {JsonParameterStore, PipeMethods} from "@tsed/schema";
import {OverrideProvider} from "@tsed/di";
import {plainToClass} from "class-transformer";
import {validate} from "class-validator";

@OverrideProvider(ValidationPipe)
export class ClassValidationPipe extends ValidationPipe implements PipeMethods<any> {
  async transform(value: any, metadata: JsonParameterStore) {
    if (!this.shouldValidate(metadata)) {
      // there is no type and collectionType
      return value;
    }

    const object = plainToClass(metadata.type, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new ValidationError("Oops something is wrong", errors);
    }

    return value;
  }

  protected shouldValidate(metadata: JsonParameterStore): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];

    return !(metadata.type || metadata.collectionType) || !types.includes(metadata.type);
  }
}
