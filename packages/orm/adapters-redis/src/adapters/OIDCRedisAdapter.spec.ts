import {Adapters} from "@tsed/adapters";
import {IORedisTest, registerConnectionProvider} from "@tsed/ioredis";
import {Redis} from "ioredis";
// @ts-ignore
import IORedisMock from "ioredis-mock";
import moment from "moment";

import {OIDCRedisAdapter} from "./OIDCRedisAdapter.js";

const REDIS_CONNECTION = Symbol.for("redis_connection");

registerConnectionProvider({
  token: REDIS_CONNECTION
});
function createAdapterFixture(collectionName: string) {
  const adapter = IORedisTest.get<Adapters>(Adapters).invokeAdapter({
    collectionName,
    model: Object,
    adapter: OIDCRedisAdapter
  }) as OIDCRedisAdapter<any>;

  const redis = IORedisTest.get<Redis>(REDIS_CONNECTION);

  return {adapter, redis};
}

async function createInitialDBFixture() {
  const {adapter} = await createAdapterFixture("AccessToken");

  const payload = {
    grantId: "grantId",
    userCode: "userCode",
    uid: "uid",
    _id: "id"
  };

  await adapter.upsert("id", payload);

  return adapter;
}

describe("OIDCRedisAdapter", () => {
  beforeEach(() => IORedisTest.create());
  afterEach(() => IORedisTest.reset());

  describe("onInsert()", () => {
    it("should test if the table is grantable and add index for grantId and the current payload", async () => {
      const {adapter, redis} = await createAdapterFixture("AccessToken");

      const payload = {
        grantId: "grantId",
        userCode: "userCode",
        uid: "uid",
        _id: "id"
      };

      await adapter.upsert("id", payload);

      const keys = await redis.keys("$oidc:*");

      expect(await redis.get("$oidc:grant:grantId")).toEqual(["AccessToken:id"]);
      expect(keys).toEqual(["$oidc:grant:grantId", "$oidc:userCode:userCode", "$oidc:uid:uid"]);
    });
    it("should set the expiration ttl", async () => {
      const {adapter, redis} = await createAdapterFixture("AccessToken");

      const payload = {
        grantId: "grantId",
        userCode: "userCode",
        uid: "uid",
        _id: "id"
      };

      await adapter.upsert("id", payload, moment().add(2, "days").toDate());

      const ttl = await redis.ttl("$oidc:grant:grantId");

      expect(ttl).toBeGreaterThan(100000);
    });
    it("should create grant indexes if the payload type isn't grantable", async () => {
      const {adapter, redis} = await createAdapterFixture("Other");

      const payload = {
        grantId: "grantId",
        userCode: "userCode",
        uid: "uid",
        _id: "id"
      };

      await adapter.upsert("id", payload);

      const keys = await redis.keys("$oidc:*");

      expect(keys).toEqual(["$oidc:userCode:userCode", "$oidc:uid:uid"]);
    });
  });

  describe("findByUid()", () => {
    it("should retrieve the payload by his uid", async () => {
      const adapter = await createInitialDBFixture();

      const result = await adapter.findByUid("uid");

      expect(result).toEqual({
        _id: "id",
        grantId: "grantId",
        uid: "uid",
        userCode: "userCode"
      });
    });
    it("should not retrieve the payload by his uid", async () => {
      const adapter = await createInitialDBFixture();

      const result = await adapter.findByUid("wrong");

      expect(result).toEqual(null);
    });
  });

  describe("findByUserCode()", () => {
    it("should retrieve the payload by his userCode", async () => {
      const adapter = await createInitialDBFixture();

      const result = await adapter.findByUserCode("userCode");

      expect(result).toEqual({
        _id: "id",
        grantId: "grantId",
        uid: "uid",
        userCode: "userCode"
      });
    });

    it("should not retrieve the payload by his userCode", async () => {
      const adapter = await createInitialDBFixture();

      const result = await adapter.findByUserCode("wrong");

      expect(result).toEqual(null);
    });
  });

  describe("destroy()", () => {
    it("should retrieve the payload by his userCode", async () => {
      const adapter = await createInitialDBFixture();

      await adapter.destroy("id");

      const result = await adapter.findById("id");

      expect(result).toEqual(undefined);
    });
  });

  describe("revokeGrantId()", () => {
    it("should retrieve the payload by his userCode", async () => {
      const adapter = await createInitialDBFixture();

      const keys = await adapter.db.lrange("$oidc:grant:grantId", 0, -1);

      expect(keys).toEqual(["AccessToken:id"]);

      expect(await adapter.db.get("AccessToken:id")).toEqual('{"grantId":"grantId","userCode":"userCode","uid":"uid","_id":"id"}');
      expect(await adapter.db.get("$oidc:grant:grantId")).toEqual(["AccessToken:id"]);

      await adapter.revokeByGrantId("grantId");

      expect(await adapter.db.get("AccessToken:id")).toEqual(null);
      expect(await adapter.db.get("$oidc:grant:grantId")).toEqual(null);
    });
  });

  describe("consumes()", () => {
    it("should set a consume flag in redis", async () => {
      const {adapter} = await createAdapterFixture("AuthorizationCode");

      await adapter.consume("codeId");

      const result = await adapter.db.hget("AuthorizationCode:codeId", "consumed");

      expect(!isNaN(Number(result))).toBe(true);
    });
  });
});
