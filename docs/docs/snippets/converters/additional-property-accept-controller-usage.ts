import {BodyParams, Controller, Post, ReturnType} from "@tsed/common";
import {Person} from "../models/Person";

@Controller("/")
export class PersonsCtrl {

  // The payload request.body = { firstName: "John", lastName: "Doe"  }
  @Post("/")
  @ReturnType(Person) // tell to swagger that the endpoint return a Person
  async save1(@BodyParams() person: Person): Promise<Person> {
    console.log(person instanceof Person); // true
    console.log(person.firtName); // John
    console.log(person.lastName); // Doe - additional property is available

    return person;
  }
}
