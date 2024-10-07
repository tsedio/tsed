import {DITest} from "../../node/index.js";
import {InjectorService} from "../services/InjectorService.js";
import {inject} from "./inject.js";

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
});
