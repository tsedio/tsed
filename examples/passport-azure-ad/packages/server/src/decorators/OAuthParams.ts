import {Context, UsePipe} from "@tsed/common";
import {applyDecorators, StoreSet} from "@tsed/core";
import {OAuthParamsPipe} from "../pipes/OAuthParamsPipe";

export function OAuthParams(expression) {
  return applyDecorators(
    Context,
    StoreSet(OAuthParamsPipe, expression),
    UsePipe(OAuthParamsPipe)
  );
}
