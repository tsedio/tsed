import {UseFilter} from "@tsed/common";
import {OAuthParamsFilter} from "../filters/OAuthParamsFilter";

export function OAuthParams(expression) {
  return UseFilter(OAuthParamsFilter, {
    expression,
    useConverter: false,
    useValidation: false,
    paramType: "AUTH" as any
  });
}
