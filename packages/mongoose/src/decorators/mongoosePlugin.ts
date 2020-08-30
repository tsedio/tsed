import * as mongoose from "mongoose";
import {schemaOptions} from "../utils/schemaOptions";

/**
 *
 * @param {(schema: "mongoose".Schema, options?: any) => void} plugin
 * @param options
 * @returns {Function}
 * @decorator
 * @mongoose
 * @class
 */
export function MongoosePlugin(plugin: (schema: mongoose.Schema, options?: any) => void, options?: any): Function {
  return (target: any) => {
    schemaOptions(target, {
      plugins: [{plugin, options}],
    });
  };
}
