import {PlatformTest} from "@tsed/common";
import {PlatformKoaHandler} from "@tsed/platform-koa";
import {expect} from "chai";
import * as Sinon from "sinon";
import {buildPlatformHandler} from "../../../../test/helper/buildPlatformHandler";

const sandbox = Sinon.createSandbox();

describe("PlatformKoaHandler", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  afterEach(() => {
    sandbox.restore();
  });

  describe("getArg()", () => {
    it("should return KOA_CTX", async () => {
      // GIVEN
      const {param, request, h, platformHandler} = await buildPlatformHandler({
        sandbox,
        token: PlatformKoaHandler,
        type: "KOA_CTX"
      });

      request.ctx = {} as any;

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq({});
    });
    it("should return STATE", async () => {
      // GIVEN
      const {param, request, h, platformHandler} = await buildPlatformHandler({
        sandbox,
        token: PlatformKoaHandler,
        type: "LOCALS"
      });

      request.ctx = {
        state: "state"
      } as any;

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq("state");
    });
  });
});
