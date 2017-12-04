import {Registry} from "../../core/class/Registry";
import {ProviderStorable} from "../class/ProviderStorable";
import {IProviderOptions} from "../interfaces/IProviderOptions";

export const ProviderRegistry = new Registry<ProviderStorable<any>, IProviderOptions<any>>(ProviderStorable);