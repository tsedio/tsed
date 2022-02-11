import {serialize} from "@tsed/json-mapper";
import {User} from "./User";

describe("User", () => {
  it("should serialize a model", () => {
    const user = new User();
    user._id = "12345";
    user.firstName = "John";
    user.lastName = "Doe";
    user.password = "secretpassword";

    const result = serialize(user);

    expect(result).toEqual({
      firstName: "John",
      lastName: "Doe"
    });
  });
});
