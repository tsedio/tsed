import {SpecTypes} from "../domain/SpecTypes.js";

export interface JsonSchemaOptions {
  /**
   * Map properties with the alias name. By default, false
   */
  useAlias?: boolean;
  /**
   * Reference to components Object.
   */
  components?: Record<string, any>;
  /**
   * Define Spec types level
   */
  specType?: SpecTypes;
  /**
   * Define a groups restriction to generate the JsonSchema.
   * Set false to disable groups.
   */
  groups?: string[] | false;
  /**
   * Set the postfix groups name for generated model and ref.
   */
  groupsName?: string;
  /**
   * Generate custom keys when SpecType is JSON.
   */
  customKeys?: boolean;
  /**
   * Inline enums when enum instead of using $ref.
   */
  inlineEnums?: boolean;

  [key: string]: any;
}
