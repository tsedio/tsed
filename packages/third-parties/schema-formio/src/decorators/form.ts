import {nameOf, StoreSet, useDecorators} from "@tsed/core";
import {Name} from "@tsed/schema";
import {FormioForm} from "@tsed/formio-types";
import {paramCase} from "change-case";
import {FormsContainer} from "../registries/FormsContainer";

/**
 * Expose the model as Formio Form.
 * @param form
 */
export function Form(form: Partial<Omit<FormioForm, "components" | "_id">> = {}): ClassDecorator {
  return useDecorators(
    (target: any) => {
      const name = form.name || nameOf(target);
      const machineName = paramCase(name);
      FormsContainer.set(name, target as any);
      FormsContainer.set(machineName, target as any);
    },
    form.name && Name(form.name),
    form && StoreSet("formio:form", form)
  );
}
