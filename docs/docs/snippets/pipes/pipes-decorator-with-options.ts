import {RawPathParams, UsePipe} from "@tsed/platform-params";
import {useDecorators} from "@tsed/core";
import {PersonPipe} from "../services/PersonPipe";

export interface IUsePersonParamOptions {
  optional?: boolean;
}

export function UsePersonParam(expression: string, options: IUsePersonParamOptions = {}): ParameterDecorator {
  return useDecorators(
    RawPathParams(expression),
    UsePipe(PersonPipe, options) // UsePipe accept second parameter to store your options
  );
}
