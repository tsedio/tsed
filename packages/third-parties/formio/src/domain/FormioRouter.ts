import {Router} from "express";

import {Formio, FormioBase} from "./Formio.js";
import {FormioHooks} from "./FormioHooks.js";

export interface FormioRouter extends Router {
  formio: FormioBase;

  init(hooks: FormioHooks): Promise<Formio>;
}
