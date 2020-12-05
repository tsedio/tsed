import {Document, Model} from "mongoose";

export interface MongooseModel<T> extends Model<T & Document> {}
