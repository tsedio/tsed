import {isString, Type} from "@tsed/core";
import {getJsonSchema, JsonEntityStore, JsonSchemaOptions} from "@tsed/schema";
import {FormioForm} from "@tsed/formio-types";
import {execMapper} from "../registries/FormioMappersContainer";
import "../components";
import {FormsContainer} from "../registries/FormsContainer";
import {paramCase} from "change-case";

export function getFormioSchema(
  model: string | any | undefined,
  options: JsonSchemaOptions = {}
): Omit<FormioForm, "components" | "_id" | "deleted" | "owner"> | undefined {
  if (!model) {
    return undefined;
  }

  if (isString(model)) {
    return getFormioSchema(FormsContainer.get(model) as Type<any>, options);
  }

  const entity = JsonEntityStore.from(model);
  const schema = getJsonSchema(entity, {
    ...options,
    customKeys: true
  });

  const name = entity.schema.getName();
  const machineName = paramCase(name);

  return ({
    title: name,
    type: "form",
    display: "form",
    tags: [],
    access: [],
    submissionAccess: [],
    ...entity.store.get<any>("formio:form", {}),
    name: machineName,
    machineName,
    components: execMapper("properties", schema, {...options, definitions: schema.definitions})
  } as unknown) as FormioForm;
}
