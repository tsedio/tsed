import {Adapter} from "@tsed/adapters";
import {PlatformTest} from "@tsed/common";
import {Injectable} from "@tsed/di";
import {MemoryAdapter} from "../adapters/MemoryAdapter";
import {InjectAdapter} from "./injectAdapter";

describe("InjectAdapter", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.create());
  it("should inject adapter (model and collectionName)", async () => {
    class Client {}

    const stub = jest.fn();

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
