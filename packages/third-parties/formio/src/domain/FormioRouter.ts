import type {Router} from "express";

import type {Formio, FormioBase} from "./Formio.js";
import type {FormioHooks} from "./FormioHooks.js";

export interface FormioRouter extends Router {
  formio: FormioBase;

  init(hooks: FormioHooks): Promise<Formio>;
}
