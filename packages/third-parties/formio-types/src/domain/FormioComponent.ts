import type {BaseComponent} from "@formio/core";

import {FormioForm} from "./FormioForm.js";

export interface FormioComponent extends BaseComponent {
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
