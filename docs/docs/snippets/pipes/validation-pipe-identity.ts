import {JsonParameterStore, PipeMethods} from "@tsed/schema";
import {Injectable} from "@tsed/di";

@Injectable()
export class ValidationPipe implements PipeMethods {
  transform(value: any, metadata: JsonParameterStore) {
    return value;
  }
}
