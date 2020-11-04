import {MongooseModel} from "@tsed/mongoose";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {Calendar} from "./Calendar";

describe("UserModel", () => {
  beforeAll(TestMongooseContext.create);
  afterAll(TestMongooseContext.reset);

  it("should run pre and post hook", async () => {
    const calendarModel = TestMongooseContext.get<MongooseModel<Calendar>>(Calendar);
    // GIVEN
    const calendar = new calendarModel({
      name: "name"
    });

    // WHEN
    await calendar.save();

    // THEN
    expect(calendar.name).toEqual("name");
  });
});
