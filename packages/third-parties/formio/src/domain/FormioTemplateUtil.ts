import type {FormioTemplate} from "./FormioTemplate.js";

export interface FormioExportOptions {
  title: string;
  version: string;
  description: string;
  name: string;
}

export interface FormioTemplateUtil {
  import: {
    template(template: FormioTemplate, cb: (er: unknown, data: FormioTemplate) => void): void;
  };
  export(options: Partial<FormioExportOptions>, cb: (er: unknown, data: FormioTemplate) => void): void;
}
