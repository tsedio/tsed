import {type GenerateSpecOptions, generateSpec} from "./generateSpec.js";
import {OpenSpec2, OpenSpec3} from "@tsed/openspec";
import {type SpecSerializerOptions, getSpec} from "./getSpec.js";
import {Type, isPlainObject} from "@tsed/core";

export function compileSpec(model: Type<any>, options?: SpecSerializerOptions): Partial<OpenSpec3>;
export function compileSpec(options: GenerateSpecOptions): OpenSpec2 | OpenSpec3;
export function compileSpec(modelOrOptions: Type<any> | GenerateSpecOptions, options?: SpecSerializerOptions) {
  if (!isPlainObject(modelOrOptions) || options) {
    return getSpec(modelOrOptions as Type<any>, options);
  }

  return generateSpec(modelOrOptions as GenerateSpecOptions);
}
