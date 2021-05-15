import {Injectable, PipeMethods, ParamMetadata, ValidationError} from "@tsed/common";

@Injectable()
export class ParseIntPipe implements PipeMethods<string, number> {
  transform(value: string, metadata: ParamMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new ValidationError("Value must an integer or a parsable integer");
    }

    return val;
  }
}
