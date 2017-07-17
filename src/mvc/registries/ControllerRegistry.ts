import {ProxyRegistry} from "../../core/class/ProxyRegistry";
import {Registry} from "../../core/class/Registry";
/**
 * @module common/mvc
 */
/** */
import {ControllerProvider} from "../class/ControllerProvider";
import {IControllerOptions} from "../interfaces/IControllerOptions";

export const ControllerRegistry = new Registry<ControllerProvider, IControllerOptions>(ControllerProvider);

export abstract class ProxyControllerRegistry extends ProxyRegistry<ControllerProvider, IControllerOptions> {
    constructor() {
        super(ControllerRegistry);
    }
}