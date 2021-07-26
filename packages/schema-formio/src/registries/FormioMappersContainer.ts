export interface FormioMapper {
  (schema: any, options: any): any;
}

const FormioMappersContainer: Map<string, FormioMapper> = new Map();

export function registerFormioMapper(type: string, mapper: FormioMapper) {
  return FormioMappersContainer.set(type, mapper);
}

export function getFormioMapper(type: string): FormioMapper {
  // istanbul ignore next
  if (!FormioMappersContainer.has(type)) {
    throw new Error(`Formio ${type} mapper doesn't exists`);
  }
  return FormioMappersContainer.get(type)!;
}

export function execMapper(type: string, schema: any, options: any): any {
  return getFormioMapper(type)(schema, options);
}
