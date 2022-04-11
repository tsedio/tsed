import {RawPathParams, UsePipe} from "@tsed/platform-params";
import {Put} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {PersonModel} from "../models/PersonModel";
import {PersonPipe} from "../services/PersonPipe";

@Controller("/persons")
export class PersonsController {
  @Put("/:id")
  async update(
    @RawPathParams("id")
    @UsePipe(PersonPipe)
    person: PersonModel
  ) {
    // do something

    return person;
  }
}
