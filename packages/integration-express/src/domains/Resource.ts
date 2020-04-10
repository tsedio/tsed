import {MaxLength, MinLength, Property} from "@tsed/common";

export class Resource {
  @Property()
  id: string;

  @Property()
  @MinLength(3)
  @MaxLength(100)
  name: string;
}
