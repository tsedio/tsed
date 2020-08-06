import {Email, Format} from "@tsed/common";

export class Model {
  @Email()
  email: string;

  @Format("date-time")
  dateCreation: Date = new Date();
}
