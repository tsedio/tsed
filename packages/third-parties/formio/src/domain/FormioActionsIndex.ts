import {FormioActionModelCtor} from "./FormioAction.js";
import {Type} from "@tsed/core";

export interface FormioActions {
  email: FormioActionModelCtor;
  login: FormioActionModelCtor;
  resetpass: FormioActionModelCtor;
  role: FormioActionModelCtor;
  save: FormioActionModelCtor;
  sql: FormioActionModelCtor;
  webhook: FormioActionModelCtor;

  [key: string]: FormioActionModelCtor;
}

export interface FormioActionsIndex {
  actions: FormioActions & Record<string, Type<FormioActionModelCtor>>;
}
