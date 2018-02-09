import {Type} from "@tsed/core";
import {InjectorService} from "../common/di/services/InjectorService";
import {loadInjector} from "./loadInjector";

export function invoke(target: Type<any>, providers: { provide: any | symbol, use: any }[]) {

    loadInjector();

    const locals = new Map();

    providers.forEach((p) => {
        locals.set(p.provide, p.use);
    });

    return InjectorService.invoke(target, locals);
}