import {Injectable, IPipe, ParamMetadata} from "@tsed/common";

@Injectable()
export class ValidationPipe implements IPipe {
  transform(value: any, metadata: ParamMetadata) {
    return value;
  }
}
