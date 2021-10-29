import {ValidationError, PipeMethods, ParamMetadata} from "@tsed/platform-params";
import {Injectable} from "@tsed/di";

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
