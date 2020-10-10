import {OpenSpecHash, OS2Schema, OS3Schema} from "@tsed/openspec";
import {SpecTypes} from "../domain/SpecTypes";

export interface JsonSchemaOptions {
  /**
   * Map properties with the alias name. By default: false
   */
  useAlias?: boolean;
  /**
   * Reference to Schema Object.
   */
  schemas?: OpenSpecHash<OS3Schema | OS2Schema>;
  /**
   * Is root object.
   */
  root?: boolean;
  /**
   * Define Spec types level
   */
  specType?: SpecTypes;

  [key: string]: any;
}
