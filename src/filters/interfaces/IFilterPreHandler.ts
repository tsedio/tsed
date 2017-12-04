import {ParamMetadata} from "../class/ParamMetadata";
import {IFilterScope} from "./IFilterScope";

export interface IFilterPreHandler {
    (scope: IFilterScope): any;

    param?: ParamMetadata;
}