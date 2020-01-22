import {TestContext} from "@tsed/testing";
import * as Sinon from "sinon";
import {User} from "../models/User";
import {UsersService} from "../services/users/UsersService";
import {BasicProtocol} from "./BasicProtocol";

describe("BasicProtocol", () => {
  beforeEach(() => TestContext.create());
  afterEach(() => TestContext.reset());

  describe(".$onVerify()", () => {
    it("should return a user", async () => {
      // GIVEN
      const request = {};
      const username = "username@domain.fr";
      const password = "password";
      const user = new User();
      user.email = username;
      user.password = password;

      const usersService = {
        findOne: Sinon.stub().resolves(user)
      };

      const protocol: BasicProtocol = await TestContext.invoke(BasicProtocol, [
        {
          provide: UsersService,
          use: usersService
        }
      ]);

      // WHEN
      const result = await protocol.$onVerify(request as any, username, password);

      // THEN
      usersService.findOne.should.be.calledWithExactly({email: "username@domain.fr"});
      result.should.deep.equal(user);
    });
    it("should return a user", async () => {
      // GIVEN
      const request = {};
      const username = "username@domain.fr";
      const password = "password";
      const user = new User();
      user.email = username;
      user.password = `${password}2`;

      const usersService = {
        findOne: Sinon.stub().resolves(user)
      };

      const protocol: BasicProtocol = await TestContext.invoke(BasicProtocol, [
        {
          provide: UsersService,
          use: usersService
        }
      ]);

      // WHEN
      const result = await protocol.$onVerify(request as any, username, password);

      // THEN
      usersService.findOne.should.be.calledWithExactly({email: "username@domain.fr"});
      result.should.deep.equal(false);
    });
    it("should return a false when user isn't found", async () => {
      // GIVEN
      const request = {};
      const username = "username@domain.fr";
      const password = "password";

      const usersService = {
        findOne: Sinon.stub().resolves(undefined)
      };

      const protocol: BasicProtocol = TestContext.invoke(BasicProtocol, [
        {
          provide: UsersService,
          use: usersService
        }
      ]);

      // WHEN
      const result = await protocol.$onVerify(request as any, username, password);

      // THEN
      usersService.findOne.should.be.calledWithExactly({email: "username@domain.fr"});
      result.should.deep.equal(false);
    });
  });
});
