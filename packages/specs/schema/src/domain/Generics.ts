import type {JsonSchema} from "./JsonSchema.js";
import {Type} from "@tsed/core";

export type GenericValue = Type<any> | JsonSchema | String | Number | Boolean | Object | Date;
export type GenericsMap = Record<string, [GenericValue] | [GenericValue, GenericsMap]>;
export type GenericInputValue = GenericValue | [GenericValue, GenericInput];
export type GenericInput = Record<string, GenericInputValue>;
