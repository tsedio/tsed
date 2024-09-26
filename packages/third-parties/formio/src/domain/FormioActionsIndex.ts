import type {Type} from "@tsed/core";

import type {FormioActionModelCtor} from "./FormioAction.js";

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
