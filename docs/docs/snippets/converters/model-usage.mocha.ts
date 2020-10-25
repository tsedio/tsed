import {deserialize, serialize} from "@tsed/json-mapper";
import {expect} from "chai";
import {Person} from "./Person";

describe("Person", () => {
  it("should deserialize a model", () => {
    const input = {
      firstName: "firstName",
      lastName: "lastName",
      age: 0,
      skills: ["skill1"]
    };

    const result = deserialize(input, {
      type: Person
    });

    expect(result).to.be.instanceof(Person);
    expect(result).to.deep.eq({
      firstName: "firstName",
      lastName: "lastName",
      age: 0,
      skills: ["skill1"]
    });
  });

  it("should serialize a model", () => {
    const person = new Person();
    person.firstName = "firstName";
    person.lastName = "lastName";
    person.person = 0;
    person.skills = ["skill1"];

    const result = serialize(person);

    expect(result).not.to.be.instance.of(Person);
    expect(result).toEqual({
      firstName: "firstName",
      lastName: "lastName",
      age: 0,
      skills: ["skill1"]
    });
  });
});
