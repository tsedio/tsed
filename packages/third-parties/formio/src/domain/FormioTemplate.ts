import type {FormioActionItem, FormioForm, FormioRole, FormioSubmission} from "./FormioModels.js";

export interface FormioTemplate {
  roles?: Record<string, FormioRole>;
  forms: Record<string, FormioForm>;
  resources: Record<string, FormioForm>;
  actions: Record<string, FormioActionItem>;
  submissions?: Record<string, FormioSubmission[]>;
}
