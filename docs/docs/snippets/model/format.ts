import {Email, Format} from "@tsed/schema";

export class Model {
  @Email()
  email: string;

  @Format("date-time") // or @DateTime()
  dateCreation: Date = new Date();
}
