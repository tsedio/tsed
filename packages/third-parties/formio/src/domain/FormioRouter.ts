import {Router} from "express";
import {Formio, FormioBase} from "./Formio";
import {FormioHooks} from "./FormioHooks";

export interface FormioRouter extends Router {
  formio: FormioBase;

  init(hooks: FormioHooks): Promise<Formio>;
}
