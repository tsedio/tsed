import {FormioActionItem, FormioForm, FormioRole, FormioSchema, FormioSubmission, FormioToken} from "@tsed/formio-types";
import {MongooseDocument} from "@tsed/mongoose";
import {Schema} from "mongoose";

import {FormioActionModelCtor, FormioActionMongooseSchema} from "./FormioAction.js";
import {FormioBaseModel, FormioModel, FormioMongooseSchema} from "./FormioBaseModel.js";

export * from "@tsed/formio-types";

export type WithID<T> = T & {_id: string};

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
