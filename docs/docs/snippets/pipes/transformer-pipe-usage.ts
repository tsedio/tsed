import {Controller, Inject} from "@tsed/di";
import {RawPathParams, UsePipe} from "@tsed/platform-params";
import {Get} from "@tsed/schema";

import {ParseIntPipe} from "../pipes/ParseIntPipe";
import {PersonsService} from "../services/PersonsService";

@Controller("/persons")
export class PersonsController {
  @Inject()
  private personsService: PersonsService;

  @Get(":id")
  async findOne(
    @RawPathParams("id")
    @UsePipe(ParseIntPipe)
    id: number
  ) {
    return this.personsService.findOne(id);
  }
}
