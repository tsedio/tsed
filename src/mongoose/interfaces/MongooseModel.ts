import * as mongoose from "mongoose";

export interface MongooseModel<T> extends mongoose.Model<T & mongoose.Document> {}
