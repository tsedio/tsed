import {applyDecorators, StoreSet} from "@tsed/core";
import {UsePipe, Context} from "@tsed/common";
import {OAuthParamsPipe} from "../pipes/OAuthParamsPipe";

export function OAuthParams(expression) {
  return applyDecorators(
    Context,
    StoreSet(OAuthParamsPipe, expression),
    UsePipe(OAuthParamsPipe)
  )
}
