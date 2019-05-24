import {Property, Schema} from "@tsed/common";
import {applyDecorators} from "@tsed/core";

export function ObjectID(name?: string) {
  return applyDecorators(
    Property({name, use: String}),
    Schema({
      description: "Mongoose ObjectId",
      example: "5ce7ad3028890bd71749d477"
    })
  );
}
