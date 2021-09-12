import {Adapter, Adapters, MemoryAdapter} from "@tsed/adapters";
import {PlatformTest} from "@tsed/common";
import {deserialize} from "@tsed/json-mapper";
import {Format, Name, Property} from "@tsed/schema";
import {expect} from "chai";
import * as faker from "faker";

class BaseClient {
  @Format("date-time")
  createdAt: Date;
}

class Client extends BaseClient {
  @Name("id")
  _id: string;

  @Property()
  name: string;
}

describe("MemoryAdapter", () => {
  let adapter: Adapter<Client>;
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  beforeEach(() => {
    adapter = PlatformTest.get<Adapters>(Adapters).invokeAdapter<any>({
      collectionName: "clients",
      model: Client,
      adapter: MemoryAdapter
    });
  });

  describe("create()", () => {
    it("should create a new instance", async () => {
      const base = deserialize(
        {
          name: faker.name.title(),
          createdAt: faker.date.past()
        },
        {type: Client}
      );

      const client = await adapter.create(base);

      expect(client).to.be.instanceOf(Client);
      expect(client._id).to.be.a("string");
      expect(client.name).to.equal(base.name);
      expect(client.createdAt).to.deep.equal(base.createdAt);
    });

    it("should create a new instance with expireAt", async () => {
      const base = {
        name: faker.name.title()
      };

      const client = await adapter.create(base, new Date());

      expect(client).to.be.instanceOf(Client);
      expect(client._id).to.be.a("string");
      expect(client.name).to.equal(base.name);
    });
  });

  describe("upsert()", () => {
    it("should create a new instance if not exists", async () => {
      const base: any = {
        name: faker.name.title()
      };

      const client = await adapter.upsert(base._id, base);

      expect(client).to.be.instanceOf(Client);
      expect(client._id).to.be.a("string");
      expect(client.name).to.equal(base.name);
    });

    it("should update instance if exists", async () => {
      const base: any = {
        name: faker.name.title()
      };

      const client = await adapter.upsert(base._id, base);
      const client2 = await adapter.upsert(client._id, client);

      expect(client2).to.be.instanceOf(Client);
      expect(client2._id).to.be.a("string");
      expect(client2.name).to.equal(base.name);
    });
  });

  describe("updateOne()", () => {
    it("should update an instance", async () => {
      const base = {
        name: faker.name.title()
      };

      const client = await adapter.create(base);

      const update = {
        _id: client._id,
        name: faker.name.title()
      };

      const client2 = await adapter.updateOne({_id: client._id}, update);

      expect(client2).to.be.instanceOf(Client);
      expect(client2?._id).to.be.a("string");
      expect(client2?.name).to.not.equal(base.name);
      expect(client2?.name).to.equal(update.name);
    });
    it("should return undefined", async () => {
      const base = {
        name: faker.name.title()
      };

      const client = await adapter.updateOne({_id: faker.random.uuid()}, base);

      expect(client).to.equal(undefined);
    });
  });

  describe("findById()", () => {
    it("should find by ID", async () => {
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
    it("should find one item", async () => {
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
  });
  describe("findAll()", () => {
    it("should find all items", async () => {
      const base = {
        name: faker.name.title()
      };

      await adapter.create(base);

      const result = await adapter.findAll({
        name: base.name
      });

      expect(result[0]).to.be.instanceOf(Client);
      expect(result[0].name).to.equal(base.name);
    });
  });
  describe("deleteById()", () => {
    it("should delete an item by id", async () => {
      const base = {
        name: faker.name.title()
      };

      const client = await adapter.create(base);

      const result = await adapter.deleteById(client._id);

      expect(result).to.be.instanceOf(Client);
      expect(result?.name).to.equal(base.name);
    });
  });
  describe("deleteMany()", () => {
    it("should delete many", async () => {
      const base = {
        name: faker.name.title()
      };

      const client = await adapter.create(base);

      await adapter.create({
        name: faker.name.title()
      });
      await adapter.create({
        name: faker.name.title()
      });

      const result = await adapter.deleteMany(client);

      expect(result[0]).to.be.instanceOf(Client);
      expect(result[0]?.name).to.equal(base.name);
    });
  });
});
