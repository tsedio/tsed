import {Injectable} from "../../common/index.js";
import {InjectContext} from "../decorators/injectContext.js";
import type {DIContext} from "../domain/DIContext.js";
import {DITest} from "../services/DITest.js";
import {runInContext} from "../utils/asyncHookContext.js";

@Injectable()
class MyService {
  @InjectContext()
  $ctx: DIContext;

  get() {
    return this.$ctx.id;
  }
}

describe("InjectContext", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  it("should inject context", async () => {
    const ctx = DITest.createDIContext();
    const service = DITest.get<MyService>(MyService);

    const result = await runInContext(ctx, () => service.get());

    expect(result).toEqual("id");
  });
});
