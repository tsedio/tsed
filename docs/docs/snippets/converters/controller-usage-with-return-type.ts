import {BodyParams, Controller, Get, Post, ReturnType} from "@tsed/common";
import {Person} from "../models/Person";

@Controller("/")
export class PersonsCtrl {

  @Post("/")
  @ReturnType({type: Person})
  async save1(@BodyParams() person: Person): Promise<Person> {
    console.log(person instanceof Person); // true

    return person; // will be serialized according to your annotation on Person class.
  }


  @Get("/")
  @ReturnType({type: Person, collectionType: Array})
  async getPersons(): Promise<Person[]> {
    return [
      new Person()
    ];
  }
}
