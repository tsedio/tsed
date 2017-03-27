/**
 * @module mvc
 */
/** */
import {ControllerProvider} from "../class/ControllerProvider";
import {IControllerOptions} from "../interfaces/ControllerOptions";
import {Registry} from "../../core/class/Registry";
import {ProxyRegistry} from "../../core/class/ProxyRegistry";

export const ControllerRegistry = new Registry<ControllerProvider, IControllerOptions>(ControllerProvider);

export abstract class ProxyControllerRegistry extends ProxyRegistry<ControllerProvider, IControllerOptions> {
    constructor() {
        super(ControllerRegistry);
    }
}