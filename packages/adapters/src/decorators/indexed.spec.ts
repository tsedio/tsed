import {Adapter, Indexed} from "@tsed/adapters";
import {PlatformTest} from "@tsed/common";
import {Injectable} from "@tsed/di";
import {Property} from "@tsed/schema";
import {expect} from "chai";
import Sinon from "sinon";
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
    expect(clients.adapter.indexes).to.deep.eq([
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

    const stub = Sinon.stub();

    @Injectable()
    class Clients {
      @InjectAdapter({model: Client, indexes: {prop: {}}})
      adapter: Adapter<Client>;

      $onInit() {
        stub();
      }
    }

    const clients = await PlatformTest.invoke<Clients>(Clients);

    expect(clients.adapter).to.be.instanceOf(MemoryAdapter);
    expect(stub).to.have.been.calledWithExactly();
    expect(clients.adapter.collectionName).to.eq("Clients");
    expect(clients.adapter.model).to.eq(Client);
    expect(clients.adapter.indexes).to.deep.eq([
      {
        options: {},
        propertyKey: "prop"
      }
    ]);
  });
});
