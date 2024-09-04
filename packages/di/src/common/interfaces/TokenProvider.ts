import type {Type, AbstractType} from "@tsed/core";

export type TokenProvider<T = any> = string | symbol | Type<T> | AbstractType<T> | Function;
