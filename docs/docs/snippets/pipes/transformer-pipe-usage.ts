import {Controller, Get, Inject, RawPathParams, UsePipe} from "@tsed/common";
import {ParseIntPipe} from "../pipes/ParseIntPipe";
import {PersonsService} from "../services/PersonsService";

@Controller("/persons")
export class PersonsController {
  @Inject()
  private personsService: PersonsService;

  @Get(":id")
  async findOne(@RawPathParams("id")
                @UsePipe(ParseIntPipe) id: number) {

    return this.personsService.findOne(id);
  }
}
