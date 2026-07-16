import {Formio, FormioBase} from "./Formio.js";
import {FormioHooks} from "./FormioHooks.js";
import {Router} from "express";

export interface FormioRouter extends Router {
  formio: FormioBase;

  init(hooks: FormioHooks): Promise<Formio>;
}
