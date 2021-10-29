import {DeserializerPipe, PipeMethods, ParamMetadata} from "@tsed/platform-params";
import {OverrideProvider} from "@tsed/di";
import {plainToClass} from "class-transformer";

@OverrideProvider(DeserializerPipe)
export class ClassTransformerPipe implements PipeMethods {
  transform(value: any, metadata: ParamMetadata) {
    return plainToClass(metadata.type, value);
  }
}
