import type {ExtendedComponentSchema} from "formiojs";

import {FormioForm} from "./FormioForm.js";

export interface FormioComponent extends ExtendedComponentSchema {
  type: string;
  key: string;

  // additional props
  template?: string;
  dataSrc?: "json" | "url";
  data?: {
    json?: any;
    url?: string;

    [key: string]: any;
  };
  valueProperty?: string;
  customConditional?: string;
  components?: FormioComponent[];
  form?: string | FormioForm;
}
