import {Property} from "@tsed/common";

export class Person {
  @Property()
  firstName: string;

  /**
   * Accept additional properties on this model (Type checking)
   */
  [key: string]: any;
}
