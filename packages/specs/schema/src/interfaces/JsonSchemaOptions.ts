import {SpecTypes} from "../domain/SpecTypes.js";
import type {GenericsMap} from "../utils/generics.js";

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
   * Define the spec version for OPENAPI (3.1.0, 3.0.3, 3.0.2, 3.0.1, 3.0.0)
   */
  specVersion?: string;
  /**
   * Define a group restriction to generate the JsonSchema.
   * Set false to disable groups.
   */
  groups?: string[] | false;
  /**
   * Set the postfix groups name for a generated model and ref.
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
  /**
   * Represents optional generic definitions that adhere to the JSON Schema standard.
   *
   * This property allows the specification of generics when constructing or representing a JSON schema.
   * It can be used to define reusable and parameterized components within the schema structure.
   *
   * @type {GenericsMap|undefined}
   */
  generics?: GenericsMap;

  [key: string]: any;
}
