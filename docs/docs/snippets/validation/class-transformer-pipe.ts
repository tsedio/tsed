import {DeserializerPipe} from "@tsed/platform-params";
import {JsonParameterStore, PipeMethods} from "@tsed/schema";
import {OverrideProvider} from "@tsed/di";
import {plainToClass} from "class-transformer";

@OverrideProvider(DeserializerPipe)
export class ClassTransformerPipe implements PipeMethods {
  transform(value: any, metadata: JsonParameterStore) {
    return plainToClass(metadata.type, value);
  }
}
