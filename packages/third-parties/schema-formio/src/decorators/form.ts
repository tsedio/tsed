import {nameOf, StoreSet, useDecorators} from "@tsed/core";
import {FormioForm} from "@tsed/formio-types";
import {Name} from "@tsed/schema";
import {kebabCase} from "change-case";

import {FormsContainer} from "../registries/FormsContainer.js";
import {Label} from "./label.js";

/**
 * Expose the model as Formio Form.
 * @param form
 */
export function Form(form: Partial<Omit<FormioForm, "components" | "_id">> = {}): ClassDecorator {
  return useDecorators(
    (target: any) => {
      const name = form.name || nameOf(target);
      const machineName = kebabCase(name);
      FormsContainer.set(name, target as any);
      FormsContainer.set(machineName, target as any);
    },
    form.name && Name(form.name),
    form.label && Label(form.label),
    form && StoreSet("formio:form", form)
  );
}
