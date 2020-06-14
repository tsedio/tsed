import {expect} from "chai";
import {UsersService} from "./UsersService";
import { PlatformTest } from "@tsed/common";

describe("UsersService", () => {
  it("should return calendar by ID", PlatformTest.inject([UsersService], (usersService: UsersService) => {
    const item = usersService.findOne({});

    expect(usersService.findById(item._id)).to.deep.eq(item);
  }));
});
