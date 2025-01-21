import mongoose from "mongoose";

import {schemaOptions} from "../utils/schemaOptions.js";

/**
 * Attach a plugin to a schema.
 *
 * @param {(schema: "mongoose".Schema, options?: any) => void} plugin
 * @param options
 * @decorator
 * @mongoose
 * @class
 */
export function MongoosePlugin(plugin: (schema: mongoose.Schema, options?: any) => void, options?: any): ClassDecorator {
  return (target: any) => {
    schemaOptions(target, {
      plugins: [{plugin, options}]
    });
  };
}
