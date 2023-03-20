import {InjectContext} from "../decorators/inject";
import {Injectable} from "../decorators/injectable";
import {DIContext} from "../domain/DIContext";
import {DITest} from "../services/DITest";
import {runInContext} from "../utils/asyncHookContext";

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
