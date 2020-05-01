import {RawPathParams, UsePipe} from "@tsed/common";
import {applyDecorators} from "@tsed/core";
import {PersonPipe} from "../services/PersonPipe";

export interface IUsePersonParamOptions {
  optional?: boolean;
}

export function UsePersonParam(options: IUsePersonParamOptions = {}): ParameterDecorator {
  return applyDecorators(
    RawPathParams("id"),
    UsePipe(PersonPipe, options) // UsePipe accept second parameter to store your options
  );
}
