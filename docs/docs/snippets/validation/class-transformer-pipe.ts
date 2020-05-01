import {DeserializerPipe, IPipe, ParamMetadata} from "@tsed/common";
import {OverrideProvider} from "@tsed/di";
import {plainToClass} from "class-transformer";

@OverrideProvider(DeserializerPipe)
export class ClassTransformerPipe implements IPipe {
  transform(value: any, metadata: ParamMetadata) {
    return plainToClass(metadata.type, value);
  }
}
