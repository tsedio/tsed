import {DITest} from "../../node/index.js";
import {Injectable} from "../decorators/injectable.js";
import {InjectorService} from "../services/InjectorService.js";
import {inject} from "./inject.js";

@Injectable()
class ProvidersList extends Map<string, string> {}

@Injectable()
class MyService {
  readonly providersList = inject(ProvidersList);

  getValue() {
    return this.providersList.get("key");
  }
}

describe("inject()", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  it("should inject the expected provider", async () => {
    class Nested {}

    class Test {
      readonly injector = inject(InjectorService);
      readonly nested = inject(Nested);

      constructor() {
        expect(this.injector).toBeInstanceOf(InjectorService);
        expect(this.nested).not.toBeInstanceOf(Nested);
      }
    }

    await DITest.invoke(Test, [
      {
        token: Nested,
        use: {}
      }
    ]);
  });
  it("should rebuild all dependencies using invoke", async () => {
    const providersList = inject(ProvidersList);
    const myService = inject(MyService);
    providersList.set("key", "value");

    expect(inject(ProvidersList).get("key")).toEqual("value");
    expect(myService.getValue()).toEqual("value");

    const newMyService = await DITest.invoke(MyService, []);
    expect(newMyService.getValue()).toEqual(undefined);
    expect(myService.getValue()).toEqual("value");
  });
});
