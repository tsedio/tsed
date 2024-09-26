import type {Document} from "mongoose";

export type MongooseDocument<T> = T & Document;
