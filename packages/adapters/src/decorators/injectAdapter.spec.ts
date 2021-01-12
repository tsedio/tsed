import {Adapter} from "@tsed/adapters";
import {PlatformTest} from "@tsed/common";
import {Injectable} from "@tsed/di";
import {expect} from "chai";
import Sinon from "sinon";
import {MemoryAdapter} from "../adapters/MemoryAdapter";
import {InjectAdapter} from "./injectAdapter";

describe("InjectAdapter", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.create());
  it("should inject adapter (model and collectionName)", async () => {
    class Client {}

    const stub = Sinon.stub();

    @Injectable()
    class Clients {
      @InjectAdapter("client", Client)
      adapter: Adapter<Client>;

      $onInit() {
        stub();
      }
    }

    const clients = await PlatformTest.invoke<Clients>(Clients);

    expect(clients.adapter).to.be.instanceOf(MemoryAdapter);
    expect(stub).to.have.been.calledWithExactly();
    expect(clients.adapter.collectionName).to.eq("client");
    expect(clients.adapter.model).to.eq(Client);
  });
  it("should inject adapter (model only)", async () => {
    class Client {}

    @Injectable()
    class Clients {
      @InjectAdapter(Client)
      adapter: Adapter<Client>;
    }

    const clients = await PlatformTest.invoke<Clients>(Clients);

    expect(clients.adapter).to.be.instanceOf(MemoryAdapter);
    expect(clients.adapter.collectionName).to.eq("Clients");
    expect(clients.adapter.model).to.eq(Client);
  });
  it("should inject adapter (model only 2)", async () => {
    class Entity {}

    @Injectable()
    class Clients {
      @InjectAdapter(Entity)
      adapter: Adapter<Entity>;
    }

    const clients = await PlatformTest.invoke<Clients>(Clients);

    expect(clients.adapter).to.be.instanceOf(MemoryAdapter);
    expect(clients.adapter.collectionName).to.eq("Entities");
    expect(clients.adapter.model).to.eq(Entity);
  });
  it("should inject adapter (object)", async () => {
    class Client {}

    @Injectable()
    class Clients {
      @InjectAdapter({model: Client, indexes: {}})
      adapter: Adapter<Client>;
    }

    const clients = await PlatformTest.invoke<Clients>(Clients);

    expect(clients.adapter).to.be.instanceOf(MemoryAdapter);
    expect(clients.adapter.collectionName).to.eq("Clients");
    expect(clients.adapter.model).to.eq(Client);
  });
  it("should inject adapter (without $onInit)", async () => {
    class Client {}

    @Injectable()
    class Clients {
      @InjectAdapter("client", Client)
      adapter: Adapter<Client>;
    }

    const clients = await PlatformTest.invoke<Clients>(Clients);

    expect(clients.adapter).to.be.instanceOf(MemoryAdapter);
  });
});
