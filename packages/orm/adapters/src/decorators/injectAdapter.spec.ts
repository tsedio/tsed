import {Injectable} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Name, Property} from "@tsed/schema";

import {MemoryAdapter} from "../adapters/MemoryAdapter.js";
import {Adapter} from "../domain/Adapter.js";
import {adapter, InjectAdapter} from "./injectAdapter.js";

describe("InjectAdapter", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.create());
  describe("using decorator @InjectAdapter()", () => {
    it("should inject adapter (model and collectionName)", async () => {
      class Client {
        @Property()
        _id: string;

        @Name("client_id")
        clientId: string;
      }

      const stub = vi.fn();

      @Injectable()
      class Clients {
        @InjectAdapter("client", Client)
        adapter: Adapter<Client>;

        $onInit() {
          stub();
        }
      }

      const clients = await PlatformTest.invoke<Clients>(Clients);

      expect(clients.adapter).toBeInstanceOf(MemoryAdapter);
      expect(stub).toHaveBeenCalledWith();
      expect(clients.adapter.collectionName).toBe("client");
      expect(clients.adapter.model).toBe(Client);

      const client = new Client();
      client.clientId = "test";

      await clients.adapter.create(client);

      const items = (clients.adapter as MemoryAdapter<Client>).collection;
      expect(items).toEqual([
        {
          _id: expect.any(String),
          clientId: "test"
        }
      ]);
    });
    it("should inject adapter (model, collectionName and useAlias true)", async () => {
      class Client {
        @Property()
        _id: string;

        @Name("client_id")
        clientId: string;
      }

      const stub = vi.fn();

      @Injectable()
      class Clients {
        @InjectAdapter("client", Client, {useAlias: true})
        adapter: Adapter<Client>;

        $onInit() {
          stub();
        }
      }

      const clients = await PlatformTest.invoke<Clients>(Clients);

      expect(clients.adapter).toBeInstanceOf(MemoryAdapter);
      expect(stub).toHaveBeenCalledWith();
      expect(clients.adapter.collectionName).toBe("client");
      expect(clients.adapter.model).toBe(Client);
      expect(clients.adapter.useAlias).toEqual(true);

      const client = new Client();
      client.clientId = "test";

      await clients.adapter.create(client);

      const items = (clients.adapter as MemoryAdapter<Client>).collection;
      expect(items).toEqual([
        {
          _id: expect.any(String),
          client_id: "test"
        }
      ]);
    });
    it("should inject adapter (model only)", async () => {
      class Client {}

      @Injectable()
      class Clients {
        @InjectAdapter(Client)
        adapter: Adapter<Client>;
      }

      const clients = await PlatformTest.invoke<Clients>(Clients);

      expect(clients.adapter).toBeInstanceOf(MemoryAdapter);
      expect(clients.adapter.collectionName).toBe("Clients");
      expect(clients.adapter.model).toBe(Client);
    });
    it("should inject adapter (model only 2)", async () => {
      class Entity {}

      @Injectable()
      class Clients {
        @InjectAdapter(Entity)
        adapter: Adapter<Entity>;
      }

      const clients = await PlatformTest.invoke<Clients>(Clients);

      expect(clients.adapter).toBeInstanceOf(MemoryAdapter);
      expect(clients.adapter.collectionName).toBe("Entities");
      expect(clients.adapter.model).toBe(Entity);
    });
    it("should inject adapter (object)", async () => {
      class Client {}

      @Injectable()
      class Clients {
        @InjectAdapter({model: Client, indexes: {}})
        adapter: Adapter<Client>;
      }

      const clients = await PlatformTest.invoke<Clients>(Clients);

      expect(clients.adapter).toBeInstanceOf(MemoryAdapter);
      expect(clients.adapter.collectionName).toBe("Clients");
      expect(clients.adapter.model).toBe(Client);
    });
    it("should inject adapter (without $onInit)", async () => {
      class Client {}

      @Injectable()
      class Clients {
        @InjectAdapter("client", Client)
        adapter: Adapter<Client>;
      }

      const clients = await PlatformTest.invoke<Clients>(Clients);

      expect(clients.adapter).toBeInstanceOf(MemoryAdapter);
    });
  });
  describe("using function adapter()", () => {
    it("should inject adapter (model and collectionName)", async () => {
      class Client {
        @Property()
        _id: string;

        @Name("client_id")
        clientId: string;
      }

      const stub = vi.fn();

      @Injectable()
      class Clients {
        adapter = adapter("client", Client);

        $onInit() {
          stub();
        }
      }

      const clients = await PlatformTest.invoke<Clients>(Clients);

      expect(clients.adapter).toBeInstanceOf(MemoryAdapter);
      expect(stub).toHaveBeenCalledWith();
      expect(clients.adapter.collectionName).toBe("client");
      expect(clients.adapter.model).toBe(Client);

      const client = new Client();
      client.clientId = "test";

      await clients.adapter.create(client);

      const items = (clients.adapter as MemoryAdapter<Client>).collection;
      expect(items).toEqual([
        {
          _id: expect.any(String),
          clientId: "test"
        }
      ]);
    });
    it("should inject adapter (model, collectionName and useAlias true)", async () => {
      class Client {
        @Property()
        _id: string;

        @Name("client_id")
        clientId: string;
      }

      const stub = vi.fn();

      @Injectable()
      class Clients {
        adapter = adapter("client", Client, {useAlias: true});

        $onInit() {
          stub();
        }
      }

      const clients = await PlatformTest.invoke<Clients>(Clients);

      expect(clients.adapter).toBeInstanceOf(MemoryAdapter);
      expect(stub).toHaveBeenCalledWith();
      expect(clients.adapter.collectionName).toBe("client");
      expect(clients.adapter.model).toBe(Client);
      expect(clients.adapter.useAlias).toEqual(true);

      const client = new Client();
      client.clientId = "test";

      await clients.adapter.create(client);

      const items = (clients.adapter as MemoryAdapter<Client>).collection;
      expect(items).toEqual([
        {
          _id: expect.any(String),
          client_id: "test"
        }
      ]);
    });
    it("should inject adapter (model only)", async () => {
      class Client {}

      @Injectable()
      class Clients {
        adapter = adapter(Client);
      }

      const clients = await PlatformTest.invoke<Clients>(Clients);

      expect(clients.adapter).toBeInstanceOf(MemoryAdapter);
      expect(clients.adapter.collectionName).toBe("Clients");
      expect(clients.adapter.model).toBe(Client);
    });
    it("should inject adapter (model only 2)", async () => {
      class Entity {}

      @Injectable()
      class Clients {
        adapter: Adapter<Entity> = adapter(Entity);
      }

      const clients = await PlatformTest.invoke<Clients>(Clients);

      expect(clients.adapter).toBeInstanceOf(MemoryAdapter);
      expect(clients.adapter.collectionName).toBe("Entities");
      expect(clients.adapter.model).toBe(Entity);
    });
    it("should inject adapter (object)", async () => {
      class Client {}

      @Injectable()
      class Clients {
        adapter = adapter({model: Client, indexes: {}});
      }

      const clients = await PlatformTest.invoke<Clients>(Clients);

      expect(clients.adapter).toBeInstanceOf(MemoryAdapter);
      expect(clients.adapter.collectionName).toBe("Clients");
      expect(clients.adapter.model).toBe(Client);
    });
    it("should inject adapter (without $onInit)", async () => {
      class Client {}

      @Injectable()
      class Clients {
        adapter = adapter("client", Client);
      }

      const clients = await PlatformTest.invoke<Clients>(Clients);

      expect(clients.adapter).toBeInstanceOf(MemoryAdapter);
    });
  });
});
