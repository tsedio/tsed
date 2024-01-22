import {DIContext} from "@tsed/di";

export interface CatchErrorMethods {
  catch(error: any, $ctx: DIContext): any;
  finally?($ctx: DIContext): void;
}
