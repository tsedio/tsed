import {PlatformTest} from "@tsed/common";
import * as Sinon from "sinon";
import {User} from "../entities/User";
import {UserRepository} from "../repositories/UserRepository";
import {LoginLocalProtocol} from "./LoginLocalProtocol";

describe("LoginLocalProtocol", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe(".$onVerify()", () => {
    it("should return a user", async () => {
      // GIVEN
      const email = "email@domain.fr";
      const password = "password";
      const user = new User();
      user.email = email;
      user.password = password;

      const userRepository = {
        findOne: Sinon.stub().resolves(user)
      };

      const protocol: LoginLocalProtocol = await PlatformTest.invoke(LoginLocalProtocol, [
        {
          token: UserRepository,
          use: userRepository
        }
      ]);

      // WHEN
      const result = await protocol.$onVerify({email, password});

      // THEN
      userRepository.findOne.should.be.calledWithExactly({email: "email@domain.fr"});
      result.should.deep.equal(user);
    });
    it("should return a user", async () => {
      // GIVEN
      const email = "email@domain.fr";
      const password = "password";
      const user = new User();
      user.email = email;
      user.password = `${password}2`;

      const userRepository = {
        findOne: Sinon.stub().resolves(user)
      };

      const protocol: LoginLocalProtocol = await PlatformTest.invoke(LoginLocalProtocol, [
        {
          token: UserRepository,
          use: userRepository
        }
      ]);

      // WHEN
      const result = await protocol.$onVerify({email, password});

      // THEN
      userRepository.findOne.should.be.calledWithExactly({email: "email@domain.fr"});
      result.should.deep.equal(false);
    });
    it("should return a false when user isn't found", async () => {
      // GIVEN
      const request = {};
      const email = "email@domain.fr";
      const password = "password";

      const userRepository = {
        findOne: Sinon.stub().resolves(undefined)
      };

      const protocol: LoginLocalProtocol = await PlatformTest.invoke(LoginLocalProtocol, [
        {
          token: UserRepository,
          use: userRepository
        }
      ]);

      // WHEN
      const result = await protocol.$onVerify({email, password});

      // THEN
      userRepository.findOne.should.be.calledWithExactly({email: "email@domain.fr"});
      result.should.deep.equal(false);
    });
  });
});
