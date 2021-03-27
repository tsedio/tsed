import {MongooseDocument} from "@tsed/mongoose";
import {Schema, Document} from "mongoose";

export type FormioMongooseSchema<T> = Schema<Document<T>> & {
  machineName(document: MongooseDocument<T>, done: Function): void;
};

export interface FormioBaseModel<T = any> {
  schema: Schema<Document<T>>;
}

export interface FormioModel<T = any> extends FormioBaseModel<T> {
  schema: FormioMongooseSchema<T>;
}
