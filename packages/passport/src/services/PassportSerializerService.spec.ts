import {expect} from "chai";
import Sinon from "sinon";
import {PassportSerializerService, UserInfo} from "../index";
import {PlatformTest} from "@tsed/common";

describe("PassportSerializerService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(PlatformTest.reset);

  it(
    "should serialize model",
    PlatformTest.inject([PassportSerializerService], async (service: PassportSerializerService) => {
      const userInfo = new UserInfo();

      userInfo.id = "id";
      userInfo.email = "email@email.fr";
      userInfo.password = "password";

      const result = await new Promise((resolve) => service.serialize(userInfo, (...args: any[]) => resolve(args)));

      expect(result).to.deep.eq([null, '{"id":"id","email":"email@email.fr"}']);
    })
  );

  it(
    "should catch error when serializing model",
    PlatformTest.inject([PassportSerializerService], async (service: PassportSerializerService) => {
      const userInfo = new UserInfo();

      userInfo.id = "id";
      userInfo.email = "email@email.fr";
      userInfo.password = "password";

      const error = new Error("message");

      // @ts-ignore
      Sinon.stub(service.converterService, "serialize").callsFake(() => {
        throw error;
      });

      const result = await new Promise((resolve) => service.serialize(userInfo, (...args: any[]) => resolve(args)));

      expect(result).to.deep.eq([error]);
    })
  );

  it(
    "should deserialize model",
    PlatformTest.inject([PassportSerializerService], async (service: PassportSerializerService) => {
      const result = await new Promise((resolve) =>
        service.deserialize('{"id":"id","email":"email@email.fr"}', (...args: any[]) => resolve(args))
      );

      expect(result).to.deep.eq([
        null,
        {
          email: "email@email.fr",
          id: "id"
        }
      ]);
    })
  );

  it(
    "should catch error when serializing model",
    PlatformTest.inject([PassportSerializerService], async (service: PassportSerializerService) => {
      const error = new Error("message");

      // @ts-ignore
      Sinon.stub(service.converterService, "deserialize").callsFake(() => {
        throw error;
      });

      const result = await new Promise((resolve) =>
        service.deserialize('{"id":"id","email":"email@email.fr"}', (...args: any[]) => resolve(args))
      );

      expect(result).to.deep.eq([error]);
    })
  );
});
