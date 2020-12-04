import {Pattern} from "@tsed/schema";

export class Model {
  @Pattern(/^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$/)
  phone: string;
}
