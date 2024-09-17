import {isString, Type} from "@tsed/core";
import {getJsonSchema, JsonEntityStore, JsonSchemaOptions} from "@tsed/schema";
import {FormioForm} from "@tsed/formio-types";
import {execMapper} from "../registries/FormioMappersContainer.js";
import {FormsContainer} from "../registries/FormsContainer.js";
import {paramCase} from "change-case";
import "../components/anyToComponent.js";
import "../components/arrayToComponent.js";
import "../components/booleanToComponent.js";
import "../components/dateToComponent.js";
import "../components/defaultToComponent.js";
import "../components/enumToComponent.js";
import "../components/mapToComponent.js";
import "../components/nestedToComponent.js";
import "../components/numberToComponent.js";
import "../components/objectToEditGrid.js";
import "../components/panelToComponent.js";
import "../components/propertiesToComponents.js";
import "../components/stringToComponent.js";

export async function getFormioSchema(
  model: string | any | undefined,
  options: JsonSchemaOptions = {}
): Promise<Omit<FormioForm, "_id" | "deleted" | "owner"> | undefined> {
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
  const resolvers: Promise<any>[] = [];
  const components = execMapper("properties", schema, {...options, definitions: schema.definitions, resolvers});
  const form = {
    title: name,
    type: "form",
    display: "form",
    tags: [],
    access: [],
    submissionAccess: [],
    ...entity.store.get<any>("formio:form", {}),
    name: machineName,
    machineName,
    components
  };

  await Promise.all(resolvers.map((resolver: any) => resolver(form, options)));

  return form as unknown as FormioForm;
}
