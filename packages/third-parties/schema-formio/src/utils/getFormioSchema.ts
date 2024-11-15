import {isString, Type} from "@tsed/core";
import {getJsonSchema, JsonEntityStore, JsonSchemaOptions} from "@tsed/schema";
import {FormioForm} from "@tsed/formio-types";
import {execMapper} from "../registries/FormioMappersContainer.js";
import {FormsContainer} from "../registries/FormsContainer.js";
import {paramCase} from "change-case";
import "../components/anyToComponent";
import "../components/arrayToComponent";
import "../components/booleanToComponent";
import "../components/dateToComponent";
import "../components/defaultToComponent";
import "../components/enumToComponent";
import "../components/mapToComponent";
import "../components/nestedToComponent";
import "../components/numberToComponent";
import "../components/objectToEditGrid";
import "../components/panelToComponent";
import "../components/propertiesToComponents";
import "../components/stringToComponent";

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
    inlineEnums: true,
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
