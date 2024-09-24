import {useDecorators} from "@tsed/core";
import {RawPathParams, UsePipe} from "@tsed/platform-params";

import {PersonPipe} from "../services/PersonPipe";

export function UsePersonParam(expression: string): ParameterDecorator {
  return useDecorators(RawPathParams(expression), UsePipe(PersonPipe));
}
