import {InjectorService} from "@tsed/di";
import {HandlerMetadata, ParamMetadata} from "../../mvc";

export interface IHandlerContext {
  injector: InjectorService;
  request: TsED.Response;
  response: TsED.Response;
  next: TsED.NextFunction;
  metadata: HandlerMetadata;
  args: any[];
  err?: any;
}

export interface IParamContext extends IHandlerContext {
  param: ParamMetadata;
  expression?: string;
}
