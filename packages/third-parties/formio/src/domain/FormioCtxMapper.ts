import {MongooseDocument} from "@tsed/mongoose";
import {FormioAction} from "./FormioAction";
import {FormioForm, FormioRole} from "./FormioModels";

export interface FormioCtxMapper {
  forms: Map<string, MongooseDocument<FormioForm>>;
  actions: Map<string, MongooseDocument<FormioAction>>;
  roles: Map<string, MongooseDocument<FormioRole>>;
}
