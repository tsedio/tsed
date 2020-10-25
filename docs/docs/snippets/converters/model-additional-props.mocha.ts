import {deserialize, serialize} from "@tsed/json-mapper";
import {expect} from "chai";
import {Person} from "./Person";

describe("Person", () => {
  it("should deserialize a model", () => {
    const input = {
      firstName: "firstName",
      lastName: "lastName",
      age: 0,
      skills: ["skill1"],
      job: "Tech lead"
    };

    const result = deserialize(input, {
      type: Person
    });

    expect(result).to.be.instanceof(Person);
    expect(result).to.deep.eq({
      firstName: "firstName",
      lastName: "lastName",
      age: 0,
      skills: ["skill1"],
      job: "Tech lead"
    });
  });
});
