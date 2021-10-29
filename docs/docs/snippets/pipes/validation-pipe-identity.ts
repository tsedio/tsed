import {ParamMetadata, PipeMethods} from "@tsed/platform-params";
import {Injectable} from "@tsed/di";

@Injectable()
export class ValidationPipe implements PipeMethods {
  transform(value: any, metadata: ParamMetadata) {
    return value;
  }
}
