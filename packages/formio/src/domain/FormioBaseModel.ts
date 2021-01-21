import {MongooseDocument} from "@tsed/mongoose";
import {Schema} from "mongoose";

export type FormioMongooseSchema<T> = Schema<MongooseDocument<T>> & {
  machineName(document: MongooseDocument<T>, done: Function): void;
};

export interface FormioBaseModel<T = any> {
  schema: Schema<MongooseDocument<T>>;
}

export interface FormioModel<T = any> extends FormioBaseModel<T> {
  schema: FormioMongooseSchema<T>;
}
