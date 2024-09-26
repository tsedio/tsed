import type {AnySchemaObject, KeywordCxt, SchemaObjCxt, ValidateFunction} from "ajv";

export interface AjvDataValidationCtx<T extends string | number = string | number> {
  dataPath: string;
  parentData: {[K in T]: any}; // object or array
  parentDataProperty: T; // string or number
  rootData: Record<string, any> | any[];
  dynamicAnchors: {[Ref in string]?: ValidateFunction};
}

export interface AjvDataValidateFunction {
  (...args: Parameters<ValidateFunction>): boolean | Promise<any>;
}

export interface AjvSchemaValidateFunction {
  (schema: any, data: any, parentSchema?: AnySchemaObject, dataCxt?: AjvDataValidationCtx): boolean | Promise<any>;
}

export interface KeywordMethods {
  code?: (cxt: KeywordCxt, ruleType?: string) => void;
  compile?: (schema: any, parentSchema: AnySchemaObject, it: SchemaObjCxt) => AjvDataValidateFunction;
  validate?: AjvSchemaValidateFunction | AjvDataValidateFunction;
}
