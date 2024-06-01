import {FormioAccess} from "./FormioAccess.js";

export interface FormioSubmission<Data = any> extends Record<string, any> {
  _id: string | undefined;
  form: string;
  data: Data;
  owner?: string;
  roles?: string[];
  access?: FormioAccess[];
  externalIds?: {type?: string; resource?: string; id?: string}[];
  metadata?: Record<string, any>;
  created?: string;
  updated?: string;
  deleted?: string | null;
  modified?: string;
}
