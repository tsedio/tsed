import {Registry} from "@tsed/core";
import {Provider} from "../class/Provider";
import {IProvider} from "./IProvider";

export interface RegistrySettings {
    registry: Registry<Provider<any>, IProvider<any>>;
    injectable: boolean;
    buildable: boolean;
}