import {PlatformTest} from "@tsed/platform-http/testing";

import {PassportSerializerService, UserInfo} from "../index.js";

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

      expect(result).toEqual([null, '{"id":"id","email":"email@email.fr"}']);
    })
  );

  it(
    "should deserialize model",
    PlatformTest.inject([PassportSerializerService], async (service: PassportSerializerService) => {
      const result = await new Promise((resolve) =>
        service.deserialize('{"id":"id","email":"email@email.fr"}', (...args: any[]) => resolve(args))
      );

      expect(result).toEqual([
        null,
        {
          email: "email@email.fr",
          id: "id"
        }
      ]);
    })
  );

  it(
    "should catch error when deserializing model",
    PlatformTest.inject([PassportSerializerService], async (service: PassportSerializerService) => {
      const result: any = await new Promise((resolve) =>
        service.deserialize('{"id":"id","email":"email@email.fr}', (...args: any[]) => resolve(args))
      );

      expect(result[0].message).toEqual("Unterminated string in JSON at position 35");
    })
  );
});
