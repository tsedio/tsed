import {Registry} from "../../core/class/Registry";
import {ControllerProvider} from "../class/ControllerProvider";
import {IControllerOptions} from "../interfaces/IControllerOptions";

export const ControllerRegistry = new Registry<ControllerProvider, IControllerOptions>(ControllerProvider);