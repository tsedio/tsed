import {Type} from "../core/interfaces";
import {InjectorService} from "../di/services/InjectorService";
import {loadInjector} from "./loadInjector";

export function invoke(target: Type<any>, providers: { provide: any | symbol, use: any }[]) {

    loadInjector();

    const locals = new Map();

    providers.forEach((p) => {
        locals.set(p.provide, p.use);
    });

    return InjectorService.invoke(target, locals);
}