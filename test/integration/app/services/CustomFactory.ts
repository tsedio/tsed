// fooservice.ts

import {registerFactory} from "@tsed/common";

export interface ICustomFactory {
    getFoo(): string;
}

export type CustomFactory = ICustomFactory;
export const CustomFactory = Symbol("CustomFactory");

registerFactory(CustomFactory, {
    getFoo: () => "test"
});