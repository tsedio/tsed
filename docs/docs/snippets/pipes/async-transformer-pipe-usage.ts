import {Controller, Put, RawPathParams, UsePipe} from "@tsed/common";
import {PersonModel} from "../models/PersonModel";
import {PersonPipe} from "../services/PersonPipe";

@Controller("/persons")
export class PersonsController {
  @Put("/:id")
  async update(@RawPathParams("id")
               @UsePipe(PersonPipe) person: PersonModel) {

    // do something

    return person;
  }
}
