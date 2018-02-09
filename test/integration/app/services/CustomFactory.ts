// fooservice.ts

import {InjectorService} from "@tsed/common";
export interface ICustomFactory {
    getFoo(): string;
}

export type CustomFactory = ICustomFactory;
export const CustomFactory = Symbol("CustomFactory");

InjectorService.factory(CustomFactory, {
    getFoo: () => "test"
});