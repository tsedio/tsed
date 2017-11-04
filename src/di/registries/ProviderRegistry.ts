import {Registry} from "../../core/class/Registry";
import {Provider} from "../class/Provider";
import {IProviderOptions} from "../interfaces/IProviderOptions";

export const ProviderRegistry = new Registry<Provider<any>, IProviderOptions<any>>(Provider);