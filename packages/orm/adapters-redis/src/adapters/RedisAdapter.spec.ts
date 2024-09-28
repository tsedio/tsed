import {AdapterModel, Adapters, Indexed} from "@tsed/adapters";
import {IORedisTest, registerConnectionProvider} from "@tsed/ioredis";
import {deserialize} from "@tsed/json-mapper";
import {Property, Required} from "@tsed/schema";

import {RedisAdapter} from "./RedisAdapter.js";

const REDIS_CONNECTION = Symbol.for("redis_connection");

registerConnectionProvider({
  provide: REDIS_CONNECTION
});

class Client {
  @Property()
  _id: string;

  @Indexed()
  name: string;

  @Property()
  @Required()
  secret: string;
}

function createAdapterFixture<Model extends AdapterModel = Client>({
  collectionName = "client",
  model = Client
}: {collectionName?: string; model?: any} = {}) {
  const adapter = IORedisTest.get<Adapters>(Adapters).invokeAdapter<Model>({
    collectionName,
    model,
    adapter: RedisAdapter,
    useHash: collectionName === "AuthorizationCode"
  }) as RedisAdapter<Model>;

  return {adapter};
}

describe("RedisAdapter", () => {
  beforeEach(() => IORedisTest.create());
  afterEach(() => IORedisTest.reset());

  describe("create()", () => {
    it("should create a new instance", async () => {
      const {adapter} = await createAdapterFixture();

      const base = {
        name: "name",
        secret: "secret"
      };

      const client = await adapter.create(base, new Date(Date.now() + 3000));

      expect(client).toBeInstanceOf(Client);
      expect(typeof client._id).toBe("string");
      expect(client.name).toBe(base.name);

      const keys = await adapter.db.keys("*");

      expect(keys).toContain("client:" + client._id);
      expect(keys).toContain(`$idx:client:${client._id}:name(${base.name})`);
    });
  });
  describe("upsert()", () => {
    it("should upsert a new instance", async () => {
      const {adapter} = await createAdapterFixture({});

      const base = deserialize<Client>(
        {
          name: "name",
          secret: "secret"
        },
        {type: Client}
      );
      const id = "uuid";

      const client = await adapter.upsert(id, base);
      const client2 = await adapter.upsert(id, base);

      expect(client).toBeInstanceOf(Client);
      expect(typeof client._id).toBe("string");
      expect(client._id).toBe(client2._id);
      expect(client.name).toBe(base.name);

      const keys = await adapter.db.keys("*");

      expect(keys).toContain("client:" + client._id);
      expect(keys).toContain(`$idx:client:${client._id}:name(${base.name})`);
    });
  });
  describe("findById()", () => {
    it("should find item by id (get)", async () => {
      const {adapter} = await createAdapterFixture({});

      const base = {
        name: "name",
        secret: "secret"
      };

      const client = await adapter.create(base);
      const result = await adapter.findById(client._id);

      expect(result).toBeInstanceOf(Client);
      expect(result?._id).toBe(client._id);
      expect(result?.name).toBe(base.name);
    });
    it("should handle no item found by id (get)", async () => {
      const {adapter} = await createAdapterFixture({});

      const result = await adapter.findById("does not exist");

      expect(result).toBeFalsy();
    });
    it("should find item by id (hgetall)", async () => {
      const {adapter} = await createAdapterFixture<any>({
        collectionName: "AuthorizationCode",
        model: Object
      });

      const base = {
        key: "value"
      };

      const token = await adapter.create(base);
      const result = await adapter.findById(token._id);

      expect(result.key).toEqual(token.key);
    });
    it("should handle no item found by id (hgetall)", async () => {
      const {adapter} = await createAdapterFixture<any>({
        collectionName: "AuthorizationCode",
        model: Object
      });

      const result = await adapter.findById("does not exist");

      expect(result).toBeFalsy();
    });
  });
  describe("findOne()", () => {
    it("should find instance", async () => {
      const {adapter} = await createAdapterFixture({});

      const base = {
        name: "name",
        secret: "secret"
      };

      const client = await adapter.create(base);

      const result = await adapter.findOne({
        name: base.name
      });

      expect(result).toBeInstanceOf(Client);
      expect(result?.name).toBe(base.name);
      expect(result?._id).toBe(client._id);
    });
    it("should find instance by id", async () => {
      const {adapter} = await createAdapterFixture({});

      const base = {
        name: "name",
        secret: "secret"
      };

      const client = await adapter.create(base);

      const result = await adapter.findOne({
        _id: client._id,
        name: base.name
      });

      expect(result).toBeInstanceOf(Client);
      expect(result?._id).toBe(client._id);
      expect(result?.name).toBe(base.name);
    });
    it("should not find data", async () => {
      const {adapter} = await createAdapterFixture({});

      const base = {
        name: "name",
        secret: "secret",
        otherProp: "name"
      };

      await adapter.create(base);

      const result = await adapter.findOne({
        name: base.name,
        otherProp: base.otherProp
      });

      expect(result).toBeUndefined();
    });
  });
  describe("findAll()", () => {
    it("should find all data (one prop)", async () => {
      const {adapter} = await createAdapterFixture({});

      const base = {
        name: "name",
        secret: "secret"
      };

      const client = await adapter.create(base);

      const result = await adapter.findAll({
        name: base.name
      });

      expect(result[0]).toBeInstanceOf(Client);
      expect(result[0]?._id).toBe(client._id);
      expect(result[0]?.name).toBe(base.name);
    });
    it("should find all by id (one prop)", async () => {
      const {adapter} = await createAdapterFixture({});

      const base = {
        name: "name",
        secret: "secret"
      };

      const client = await adapter.create(base);

      const result = await adapter.findAll({
        _id: client._id
      });

      expect(result[0]).toBeInstanceOf(Client);
      expect(result[0]?._id).toBe(client._id);
      expect(result[0]?.name).toBe(base.name);
    });
    it("should find all items", async () => {
      const {adapter} = await createAdapterFixture({});

      const base = {
        name: "name",
        secret: "secret"
      };

      const client = await adapter.create(base);

      const result = await adapter.findAll({});

      expect(result[0]).toBeInstanceOf(Client);
      expect(result[0]?._id).toBe(client._id);
      expect(result[0]?.name).toBe(base.name);
    });
    it("should not find data when predicate has an unknown prop", async () => {
      const {adapter} = await createAdapterFixture({});

      const base = {
        name: "name",
        secret: "secret",
        otherProp: "name"
      };

      await adapter.create(base);

      const result = await adapter.findAll({
        name: base.name,
        otherProp: base.otherProp
      });

      expect(result).toEqual([]);
    });
  });
  describe("updateOne()", () => {
    it("should update one item and merge props (undefined props are filtered)", async () => {
      const {adapter} = await createAdapterFixture({});

      const base = deserialize<Client>(
        {
          name: "name",
          secret: "secret"
        },
        {type: Client}
      );

      const majItem = deserialize<Client>(
        {
          name: "name",
          secret: "secret2"
        },
        {type: Client}
      );

      const client = await adapter.create(base);
      const result = await adapter.updateOne(
        {
          name: base.name
        },
        majItem
      );

      expect(client).toBeInstanceOf(Client);
      expect(typeof client._id).toBe("string");
      expect(client._id).toBe(result?._id);
      expect(client.name).toBe(base.name);
      expect(client.secret).toBe("secret");
    });
    it("should not update item", async () => {
      const {adapter} = await createAdapterFixture({});

      const base = deserialize<Client>(
        {
          name: "name",
          secret: "secret"
        },
        {type: Client}
      );

      const client = await adapter.create(base);
      const result = await adapter.updateOne(
        {
          name: `${base.name}2`
        },
        base
      );

      expect(result).toBeUndefined();
      expect(client.name).toBe(base.name);
    });
  });
  describe("deleteOne()", () => {
    it("should remove one item", async () => {
      const {adapter} = await createAdapterFixture({});

      const base = deserialize<Client>(
        {
          name: "name",
          secret: "secret"
        },
        {type: Client}
      );

      const client = await adapter.create(base);
      const result = await adapter.deleteOne({
        name: base.name
      });

      expect(client).toBeInstanceOf(Client);
      expect(typeof client._id).toBe("string");
      expect(client._id).toBe(result?._id);
      expect(client.name).toBe(base.name);
    });
    it("should not remove item", async () => {
      const {adapter} = await createAdapterFixture({});

      const base = deserialize<Client>(
        {
          name: "name",
          secret: "secret"
        },
        {type: Client}
      );

      const client = await adapter.create(base);
      const result = await adapter.deleteOne({
        name: `${base.name}2`
      });

      expect(result).toBeUndefined();
      expect(client.name).toBe(base.name);
    });
  });
  describe("deleteById()", () => {
    it("should remove one item", async () => {
      const {adapter} = await createAdapterFixture({});

      const base = deserialize<Client>(
        {
          name: "name",
          secret: "secret"
        },
        {type: Client}
      );

      const client = await adapter.create(base);
      const result = await adapter.deleteById(client._id);

      expect(client).toBeInstanceOf(Client);
      expect(typeof client._id).toBe("string");
      expect(client._id).toBe(result?._id);
      expect(client.name).toBe(base.name);
    });
  });
  describe("deleteMany()", () => {
    it("should remove items", async () => {
      const {adapter} = await createAdapterFixture({});

      const base = deserialize<Client>(
        {
          name: "name",
          secret: "secret"
        },
        {type: Client}
      );

      const client = await adapter.create(base);
      const result = await adapter.deleteMany({
        name: base.name
      });

      expect(result[0]).toBeInstanceOf(Client);
      expect(typeof result[0]._id).toBe("string");
      expect(result[0]._id).toBe(client?._id);
      expect(result[0].name).toBe(base.name);
    });
  });
});
