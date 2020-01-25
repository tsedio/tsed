import {TestContext} from "@tsed/testing";
import * as Sinon from "sinon";
import {User} from "../entities/User";
import {LoginLocalProtocol} from "./LoginLocalProtocol";

describe("LoginLocalProtocol", () => {
  beforeEach(() => TestContext.create());
  afterEach(() => TestContext.reset());

  describe(".$onVerify()", () => {
    it("should return a user", async () => {
      // GIVEN
      const request = {};
      const email = "email@domain.fr";
      const password = "password";
      const user = new User();
      user.email = email;
      user.password = password;

      const userRepository = {
        findOne: Sinon.stub().resolves(user)
      };

      const protocol: LoginLocalProtocol = await TestContext.invoke(LoginLocalProtocol, [
        {
          provide: UserRepository,
          use: userRepository
        }
      ]);

      // WHEN
      const result = await protocol.$onVerify(request as any, {email, password});

      // THEN
      userRepository.findOne.should.be.calledWithExactly({email: "email@domain.fr"});
      result.should.deep.equal(user);
    });
    it("should return a user", async () => {
      // GIVEN
      const request = {};
      const email = "email@domain.fr";
      const password = "password";
      const user = new User();
      user.email = email;
      user.password = `${password}2`;

      const userRepository = {
        findOne: Sinon.stub().resolves(user)
      };

      const protocol: LoginLocalProtocol = await TestContext.invoke(LoginLocalProtocol, [
        {
          provide: UserRepository,
          use: userRepository
        }
      ]);

      // WHEN
      const result = await protocol.$onVerify(request as any, {email, password});

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

      const protocol: LoginLocalProtocol = await TestContext.invoke(LoginLocalProtocol, [
        {
          provide: UserRepository,
          use: userRepository
        }
      ]);

      // WHEN
      const result = await protocol.$onVerify(request as any, {email, password});

      // THEN
      userRepository.findOne.should.be.calledWithExactly({email: "email@domain.fr"});
      result.should.deep.equal(false);
    });
  });
});
