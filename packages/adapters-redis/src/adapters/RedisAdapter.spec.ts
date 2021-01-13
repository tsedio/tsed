import {Adapters, Indexed} from "@tsed/adapters";
import {RedisAdapter} from "@tsed/adapters-redis";
import {PlatformTest} from "@tsed/common";
import {deserialize} from "@tsed/json-mapper";
import {Property} from "@tsed/schema";
import {expect} from "chai";
import * as faker from "faker";
import IORedis from "ioredis";

const IORedisMock = require("ioredis-mock");

class Client {
  @Property()
  _id: string;

  @Indexed()
  name: string;
}

describe("RedisAdapter", () => {
  let adapter: RedisAdapter<Client>;
  beforeEach(() => PlatformTest.create({}));
  afterEach(() => PlatformTest.reset());
  beforeEach(() => {
    const locals = new Map();
    locals.set(IORedis, new IORedisMock());

    adapter = PlatformTest.get<Adapters>(Adapters).invokeAdapter<Client>({
      collectionName: "clients",
      model: Client,
      adapter: RedisAdapter,
      locals
    }) as RedisAdapter<Client>;
  });

  after(async () => {
    await adapter.deleteMany({});
  });

  describe("create()", async () => {
    it("should create a new instance", async () => {
      const base = {
        name: faker.name.title()
      };

      const client = await adapter.create(base, new Date(Date.now() + 3000));

      expect(client).to.be.instanceOf(Client);
      expect(client._id).to.be.a("string");
      expect(client.name).to.equal(base.name);

      const keys = await adapter.db.keys("*");

      expect(keys).include("clients:" + client._id);
      expect(keys).include(`$idx:clients:${client._id}:name(${base.name})`);
    });
  });

  describe("upsert()", async () => {
    it("should upsert a new instance", async () => {
      const base = deserialize<Client>(
        {
          name: faker.name.title()
        },
        {type: Client}
      );
      const id = faker.random.uuid();

      const client = await adapter.upsert(id, base);
      const client2 = await adapter.upsert(id, base);

      expect(client).to.be.instanceOf(Client);
      expect(client._id).to.be.a("string");
      expect(client._id).to.be.equal(client2._id);
      expect(client.name).to.equal(base.name);

      const keys = await adapter.db.keys("*");

      expect(keys).include("clients:" + client._id);
      expect(keys).include(`$idx:clients:${client._id}:name(${base.name})`);
    });
  });

  describe("findById()", () => {
    it("should create a new instance", async () => {
      const base = {
        name: faker.name.title()
      };

      const client = await adapter.create(base);
      const result = await adapter.findById(client._id);

      expect(result).to.be.instanceOf(Client);
      expect(result?._id).to.equal(client._id);
      expect(result?.name).to.equal(base.name);
    });
  });

  describe("findOne()", () => {
    it("should find instance", async () => {
      const base = {
        name: faker.name.title()
      };

      const client = await adapter.create(base);

      const result = await adapter.findOne({
        name: base.name
      });

      expect(result).to.be.instanceOf(Client);
      expect(result?._id).to.equal(client._id);
      expect(result?.name).to.equal(base.name);
    });
    it("should find instance by id", async () => {
      const base = {
        name: faker.name.title()
      };

      const client = await adapter.create(base);

      const result = await adapter.findOne({
        _id: client._id,
        name: base.name
      });

      expect(result).to.be.instanceOf(Client);
      expect(result?._id).to.equal(client._id);
      expect(result?.name).to.equal(base.name);
    });
    it("should not find data", async () => {
      const base = {
        name: faker.name.title(),
        otherProp: faker.name.title()
      };

      const client = await adapter.create(base);

      const result = await adapter.findOne({
        name: base.name,
        otherProp: base.otherProp
      });

      expect(result).to.eq(undefined);
    });
  });
  describe("findAll()", () => {
    it("should find all data (one prop)", async () => {
      const base = {
        name: faker.name.title()
      };

      const client = await adapter.create(base);

      const result = await adapter.findAll({
        name: base.name
      });

      expect(result[0]).to.be.instanceOf(Client);
      expect(result[0]?._id).to.equal(client._id);
      expect(result[0]?.name).to.equal(base.name);
    });
    it("should find all by id (one prop)", async () => {
      const base = {
        name: faker.name.title()
      };

      const client = await adapter.create(base);

      const result = await adapter.findAll({
        _id: client._id
      });

      expect(result[0]).to.be.instanceOf(Client);
      expect(result[0]?._id).to.equal(client._id);
      expect(result[0]?.name).to.equal(base.name);
    });
    it("should find all items", async () => {
      const base = {
        name: faker.name.title()
      };

      const client = await adapter.create(base);

      const result = await adapter.findAll({});

      expect(result[0]).to.be.instanceOf(Client);
      expect(result[0]?._id).to.equal(client._id);
      expect(result[0]?.name).to.equal(base.name);
    });
    it("should not find data when predicate has an unknown prop", async () => {
      const base = {
        name: faker.name.title(),
        otherProp: faker.name.title()
      };

      await adapter.create(base);

      const result = await adapter.findAll({
        name: base.name,
        otherProp: base.otherProp
      });

      expect(result).to.deep.eq([]);
    });
  });
  describe("updateOne()", () => {
    it("should update one item", async () => {
      const base = deserialize<Client>(
        {
          name: faker.name.title()
        },
        {type: Client}
      );

      const client = await adapter.create(base);
      const result = await adapter.updateOne(
        {
          name: base.name
        },
        base
      );

      expect(client).to.be.instanceOf(Client);
      expect(client._id).to.be.a("string");
      expect(client._id).to.be.equal(result?._id);
      expect(client.name).to.equal(base.name);
    });
    it("should not update item", async () => {
      const base = deserialize<Client>(
        {
          name: faker.name.title()
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

      expect(result).to.eq(undefined);
      expect(client.name).to.equal(base.name);
    });
  });
  describe("deleteOne()", () => {
    it("should remove one item", async () => {
      const base = deserialize<Client>(
        {
          name: faker.name.title()
        },
        {type: Client}
      );

      const client = await adapter.create(base);
      const result = await adapter.deleteOne({
        name: base.name
      });

      expect(client).to.be.instanceOf(Client);
      expect(client._id).to.be.a("string");
      expect(client._id).to.be.equal(result?._id);
      expect(client.name).to.equal(base.name);
    });
    it("should not remove item", async () => {
      const base = deserialize<Client>(
        {
          name: faker.name.title()
        },
        {type: Client}
      );

      const client = await adapter.create(base);
      const result = await adapter.deleteOne({
        name: `${base.name}2`
      });

      expect(result).to.eq(undefined);
      expect(client.name).to.equal(base.name);
    });
  });
  describe("deleteById()", () => {
    it("should remove one item", async () => {
      const base = deserialize<Client>(
        {
          name: faker.name.title()
        },
        {type: Client}
      );

      const client = await adapter.create(base);
      const result = await adapter.deleteById(client._id);

      expect(client).to.be.instanceOf(Client);
      expect(client._id).to.be.a("string");
      expect(client._id).to.be.equal(result?._id);
      expect(client.name).to.equal(base.name);
    });
  });
  describe("deleteMany()", () => {
    it("should remove items", async () => {
      const base = deserialize<Client>(
        {
          name: faker.name.title()
        },
        {type: Client}
      );

      const client = await adapter.create(base);
      const result = await adapter.deleteMany({
        name: base.name
      });

      expect(result[0]).to.be.instanceOf(Client);
      expect(result[0]._id).to.be.a("string");
      expect(result[0]._id).to.be.equal(client?._id);
      expect(result[0].name).to.equal(base.name);
    });
  });
});
