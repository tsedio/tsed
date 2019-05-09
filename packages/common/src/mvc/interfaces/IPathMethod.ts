import {PathParamsType} from "./PathParamsType";

export interface IPathMethod {
  path: PathParamsType;
  isFinal?: boolean;
  method?: string;
}
