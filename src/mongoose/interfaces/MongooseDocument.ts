import * as mongoose from "mongoose";

export type MongooseDocument<T> = T & mongoose.Document;