import {Type} from "@tsed/core";

import type {JsonSchema} from "./JsonSchema.js";

export type GenericValue = Type<any> | JsonSchema | String | Number | Boolean | Object | Date;
export type GenericsMap = Record<string, [GenericValue] | [GenericValue, GenericsMap]>;
export type GenericInputValue = GenericValue | [GenericValue, GenericInput];
export type GenericInput = Record<string, GenericInputValue>;
