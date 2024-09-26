import type {FormioAction, FormioForm, FormioRole} from "@tsed/formio-types";
import type {MongooseDocument} from "@tsed/mongoose";

export interface FormioCtxMapper {
  forms: Map<string, MongooseDocument<FormioForm>>;
  actions: Map<string, MongooseDocument<FormioAction>>;
  roles: Map<string, MongooseDocument<FormioRole>>;
}
