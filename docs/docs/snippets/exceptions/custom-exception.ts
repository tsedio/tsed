import {BadRequest} from "@tsed/exceptions";

export class IDFormatException extends BadRequest {
  constructor() {
    super("ID format is not valid");
  }
}
