import {Adapter, Indexed} from "@tsed/adapters";
import {PlatformTest} from "@tsed/common";
import {Injectable} from "@tsed/di";
import {Property} from "@tsed/schema";
import {MemoryAdapter} from "../adapters/MemoryAdapter";
import {InjectAdapter} from "./injectAdapter";

describe("Indexed", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.create());
  it("should inject adapter with indexed keys", async () => {
    class Client {
      @Indexed()
      prop: string;
    }

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
    expect(clients.adapter.indexes).toEqual([
      {
        options: {},
        propertyKey: "prop"
      }
    ]);
  });
  it("should inject adapter with indexed keys (by decorator)", async () => {
    class Client {
      @Property()
      prop: string;
    }

    const stub = jest.fn();

    @Injectable()
    class Clients {
      @InjectAdapter({model: Client, indexes: {prop: {}}})
      adapter: Adapter<Client>;

      $onInit() {
        stub();
      }
    }

    const clients = await PlatformTest.invoke<Clients>(Clients);

    expect(clients.adapter).toBeInstanceOf(MemoryAdapter);
    expect(stub).toHaveBeenCalledWith();
    expect(clients.adapter.collectionName).toBe("Clients");
    expect(clients.adapter.model).toBe(Client);
    expect(clients.adapter.indexes).toEqual([
      {
        options: {},
        propertyKey: "prop"
      }
    ]);
  });
});
