import {Registry} from "../../core/class/Registry";
import {MiddlewareProvider} from "../class/MiddlewareProvider";
import {IMiddlewareOptions} from "../interfaces/IMiddlewareOptions";

export const MiddlewareRegistry = new Registry<MiddlewareProvider, IMiddlewareOptions>(MiddlewareProvider);