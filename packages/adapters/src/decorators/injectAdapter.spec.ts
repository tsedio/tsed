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
  it("should inject adapter", async () => {
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
