import {ParamMetadata} from "../../mvc/models/ParamMetadata";
import {IFilterScope} from "../../mvc/interfaces/IFilterScope";

export interface IFilterPreHandler {
  (scope: IFilterScope): any;

  param?: ParamMetadata;
}
