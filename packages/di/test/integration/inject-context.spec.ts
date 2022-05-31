import {DIContext, DITest, Injectable, InjectContext, runInContext} from "@tsed/di";

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

  it("should inject context", () => {
    const ctx = DITest.createDIContext();
    const service = DITest.get<MyService>(MyService);

    const result = runInContext(ctx, () => service.get());

    expect(result).toEqual("id");
  });
});
