import {BodyParams, Controller, Get, Inject, UsePipe} from "@tsed/common";
import {UseJoiSchema} from "../decorators/UseJoiSchema";
import {PersonModel, joiPersonModel} from "../models/PersonModel";

@Controller("/persons")
export class PersonsController {
  @Get(":id")
  async findOne(@BodyParams("id")
                @UseJoiSchema(joiPersonModel) person: PersonModel) {

    return person;
  }
}
