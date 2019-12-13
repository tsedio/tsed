import {MongooseModel} from "@tsed/mongoose";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {expect} from "chai";
import {Calendar} from "./Calendar";

describe("UserModel", () => {
  beforeEach(TestMongooseContext.create);
  afterEach(TestMongooseContext.reset);

  it("should run pre and post hook", TestMongooseContext.inject([Calendar], async (calendarModel: MongooseModel<Calendar>) => {
    // GIVEN
    const calendar = new calendarModel({
      name: "name"
    });

    // WHEN
    await calendar.save();

    // THEN
    expect(calendar.name).to.equal("name");
  }));
});
