import {BodyParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {UseJoiSchema} from "../decorators/UseJoiSchema";
import {joiPersonModel, PersonModel} from "../models/PersonModel";

@Controller("/persons")
export class PersonsController {
  @Get(":id")
  async findOne(
    @BodyParams("id")
    @UseJoiSchema(joiPersonModel)
    person: PersonModel
  ) {
    return person;
  }
}
