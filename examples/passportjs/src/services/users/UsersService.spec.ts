import {inject} from "@tsed/testing";
import {expect} from "chai";
import {UsersService} from "./UsersService";

describe("UsersService", () => {
  it("should return calendar by ID", inject([UsersService], (usersService: UsersService) => {
    const item = usersService.findOne({});

    expect(usersService.findById(item._id)).to.deep.eq(item);
  }));
});
