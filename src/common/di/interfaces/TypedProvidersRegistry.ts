import {Registry} from "@tsed/core";
import {Provider} from "../class/Provider";
import {IProvider} from "./IProvider";

export type TypedProvidersRegistry = Registry<Provider<any>, IProvider<any>>;
