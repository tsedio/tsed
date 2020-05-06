import {RawPathParams, UsePipe} from "@tsed/common";
import {applyDecorators} from "@tsed/core";
import {PersonPipe} from "../services/PersonPipe";

export function UsePersonParam(expression: string): ParameterDecorator {
  return applyDecorators(
    RawPathParams(expression),
    UsePipe(PersonPipe)
  );
}
