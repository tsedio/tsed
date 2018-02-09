import {Registry} from "@tsed/core";
import {ControllerProvider} from "../class/ControllerProvider";
import {IControllerOptions} from "../interfaces/IControllerOptions";

export const ControllerRegistry = new Registry<ControllerProvider, IControllerOptions>(ControllerProvider);