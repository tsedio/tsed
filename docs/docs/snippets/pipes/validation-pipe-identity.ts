import {Injectable} from "@tsed/di";
import {JsonParameterStore, PipeMethods} from "@tsed/schema";

@Injectable()
export class ValidationPipe implements PipeMethods {
  transform(value: any, metadata: JsonParameterStore) {
    return value;
  }
}
