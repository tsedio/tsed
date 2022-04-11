import {ValidationError} from "@tsed/platform-params";
import {JsonParameterStore, PipeMethods} from "@tsed/schema";
import {Injectable} from "@tsed/di";

@Injectable()
export class ParseIntPipe implements PipeMethods<string, number> {
  transform(value: string, metadata: JsonParameterStore): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new ValidationError("Value must an integer or a parsable integer");
    }

    return val;
  }
}
