import {Email, Format} from "@tsed/schema";

export class Model {
  @Email()
  email: string;

  @Format("date-time")
  dateCreation: Date = new Date();
}
