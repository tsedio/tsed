import {RawPathParams, UsePipe} from "@tsed/common";
import {applyDecorators} from "@tsed/core";
import {PersonPipe} from "../services/PersonPipe";

export function UsePersonParam(): ParameterDecorator {
  return applyDecorators(
    RawPathParams("id"),
    UsePipe(PersonPipe)
  );
}
