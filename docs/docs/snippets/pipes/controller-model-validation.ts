import {Controller, Post} from "@tsed/common";
import {BodyParams} from "./body-params";
import {PersonModel} from "../models/PersonModel"

@Controller("/persons")
export class PersonsController {
  @Post("/")
  save(@BodyParams() person: PersonModel) {
    return person;
  }
}
