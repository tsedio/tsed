import {ConverterService, PropertyRegistry} from "@tsed/common/src";
import {buildMongooseSchema, MongooseModel} from "@tsed/mongoose";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {expect} from "chai";
import {User, UserCreation} from "../src/models/User";

describe("UserModel", () => {
  beforeEach(TestMongooseContext.create);
  afterEach(TestMongooseContext.reset);

  it("should create a new user", TestMongooseContext.inject([User, ConverterService], async (userModel: MongooseModel<User>, converterService: ConverterService) => {
    // GIVEN
    const userCreation = new UserCreation();
    userCreation.name = "name";
    userCreation.email = "test@test.fr";
    userCreation.password = "test123456";

    const user = new userModel(userCreation);

    // WHEN
    await user.save();

    // THEN
    const properties = PropertyRegistry.getProperties(User, {withIgnoredProps: true});
    const {schema} = buildMongooseSchema(User);

    expect(Array.from(properties.keys())).to.deep.eq(["name", "email", "password"]);
    expect(Object.keys(schema)).to.deep.eq(["name", "email", "password"]);

    expect(user.email).to.equal("test@test.fr");
    expect(user.password).to.equal("test123456");
    expect(converterService.serialize(user, {type: User, withIgnoredProps: false})).to.deep.eq({
      name: "name",
      email: "test@test.fr"
    });
  }));
});
