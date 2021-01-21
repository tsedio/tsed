import {MongooseDocument} from "@tsed/mongoose";
import {Schema} from "mongoose";
import {FormioActionModelCtor, FormioActionMongooseSchema} from "./FormioAction";
import {FormioBaseModel, FormioModel, FormioMongooseSchema} from "./FormioBaseModel";

export interface FormioActionItem<T = any> {
  _id: string | undefined;
  title: string;
  form: string;
  submission?: string;
  action: string;
  handler: string;
  method: string;
  state: "new" | "inprogress" | "complete" | "error";
  messages: any[];
  data: T;
}

export interface FormioAccess {
  _id: string | undefined;
  type: string;
  resources: any[];
}

export interface FormioPermission {
  type: "create_all" | "read_all" | "update_all" | "delete_all" | "create_own" | "read_own" | "update_own" | "delete_own" | "self";
  roles: string[];
}

export interface FormioComponent {
  type: string;
  input?: boolean;
  label: string;
  key: string;
  placeholder?: string;
  template?: string;
  dataSrc?: "json" | "url";
  data?: {
    json?: any;
    url?: string;

    [key: string]: any;
  };
  valueProperty?: string;
  multiple?: boolean;
  validate?: {
    required?: boolean;
    [key: string]: any;
  };
  customConditional?: string;
  components?: FormioForm[];
  legend?: string;
  tree?: boolean;
  tableView?: boolean;
  protected?: boolean;
  persistent?: boolean;
  hidden?: boolean;
  clearOnHide?: boolean;
  form?: string | FormioForm;
  filter?: string;

  [key: string]: any;
}

export interface FormioForm {
  _id: string | undefined;
  /**
   * The title for the form
   */
  title: string;
  /**
   * The machine name for this form
   */
  name: string;
  /**
   * The path for this resource
   */
  path: string;
  /**
   * The form type.
   */
  type: "form" | "resource";
  /**
   * The display method for this form
   */
  display?: string;
  /**
   * A custom action URL to submit the data to.
   */
  action?: string;

  tags?: string[];

  deleted: number | null;
  /**
   * Access rules
   */
  access: FormioPermission[];
  /**
   * Submission access ruules
   */
  submissionAccess: FormioPermission[];
  /**
   *
   */
  owner: string;
  /**
   * Components.
   */
  components: FormioComponent[];
  /**
   * Custom form settings object.
   */
  settings?: any;
  /**
   * Custom form properties.
   */
  properties?: any;

  [key: string]: any;
}

export interface FormioRole {
  _id: string | undefined;
  title: string;
  description: string;
  deleted: number | null;
  default: boolean;
  admin: boolean;
}

export interface FormioSchema {
  key: string;
  isLocked: boolean;
  version: string;
  value: string;
}

export interface FormioSubmission<T = any> {
  _id: string | undefined;
  form: string;
  owner?: string;
  delete: number | null;
  roles?: string[];
  access?: FormioAccess[];
  externalIds?: {type?: string; resource?: string; id?: string}[];
  /**
   * Configurable metadata.
   */
  metadata: any;
  data: T;
  created: string;
  updated: string;
  // deleted: string;
  modified: string;
}

export interface FormioToken {
  key: string;
  value: string;
  expireAt: Date;
}

export interface FormioSchemas {
  action: FormioActionMongooseSchema;
  actionItem: Schema<MongooseDocument<FormioActionItem>>;
  form: FormioMongooseSchema<FormioForm>;
  role: FormioMongooseSchema<FormioRole>;
  schema: Schema<MongooseDocument<FormioSchema>>;
  submission: Schema<MongooseDocument<FormioSubmission>>;
  token: Schema<MongooseDocument<FormioToken>>;

  [key: string]: Schema<MongooseDocument<any>>;
}

export type FormioModelsModels = {
  action: FormioActionModelCtor;
  actionItem: FormioBaseModel<FormioActionItem>;
  form: FormioModel<FormioForm>;
  role: FormioModel<FormioRole>;
  schema: FormioBaseModel<FormioSchema>;
  submission: FormioBaseModel<FormioSubmission>;
  token: FormioBaseModel<FormioToken>;
} & Record<string, FormioBaseModel>;

export interface FormioModels {
  schemas: FormioSchemas;
  models: FormioModelsModels;
  specs: {
    action: any;
    actionItem: any;
    form: any;
    role: any;
    schema: any;
    submission: any;
    token: any;

    [key: string]: any;
  };
}
