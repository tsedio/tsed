import {Controller} from "@tsed/di";
import {Post} from "@tsed/schema";

import {PersonModel} from "../models/PersonModel";
import {BodyParams} from "./body-params";

@Controller("/persons")
export class PersonsController {
  @Post("/")
  save(@BodyParams() person: PersonModel) {
    return person;
  }
}
