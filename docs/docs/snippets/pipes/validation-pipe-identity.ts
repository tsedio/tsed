import {Injectable, PipeMethods, ParamMetadata} from "@tsed/common";

@Injectable()
export class ValidationPipe implements PipeMethods {
  transform(value: any, metadata: ParamMetadata) {
    return value;
  }
}
