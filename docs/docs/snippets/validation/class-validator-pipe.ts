import {IPipe, OverrideProvider, ParamMetadata, ValidationError, ValidationPipe} from "@tsed/common";
import {plainToClass} from "class-transformer";
import {validate} from "class-validator";

@OverrideProvider(ValidationPipe)
export class ClassValidationPipe extends ValidationPipe implements IPipe<any> {
  async transform(value: any, metadata: ParamMetadata) {
    if (!this.shouldValidate(metadata)) { // there is no type and collectionType
      return value;
    }

    const object = plainToClass(metadata.type, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new ValidationError("Oops something is wrong", errors);
    }

    return value;
  }

  protected shouldValidate(metadata: ParamMetadata): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];

    return !super.shouldValidate(metadata) || !types.includes(metadata.type);
  }
}
