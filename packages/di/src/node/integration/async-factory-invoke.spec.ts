import {DITest, Inject, Injectable, registerProvider} from "../../index.js";

const PrimaryPostgresDb = Symbol.for("PrimaryPostgresDb");
type PrimaryPostgresDb = {id: string};

registerProvider({
  provide: PrimaryPostgresDb,
  useAsyncFactory: () => {
    return Promise.resolve({
      id: "id"
    });
  }
});

@Injectable()
export class MyService {
  @Inject(PrimaryPostgresDb)
  protected dataSource: PrimaryPostgresDb;

  me() {
    return this.dataSource.id;
  }
}

describe("AsyncFactory", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  it("should inject async factory and return resolve promise value (first test)", () => {
    const service = DITest.get<MyService>(MyService);

    const result = service.me();

    expect(result).toEqual("id");
  });

  it("should inject async factory and return resolve promise value (second test)", () => {
    const service = DITest.get<MyService>(MyService);

    const result = service.me();
    expect(result).toEqual("id");
  });

  it("should inject async factory and return resolve promise value (first test - invoke)", async () => {
    const service = await DITest.invoke<MyService>(MyService, []);

    const result = service.me();

    expect(result).toEqual("id");
  });

  it("should inject async factory and return resolve promise value (second test - invoke)", async () => {
    const service = await DITest.invoke<MyService>(MyService, []);

    const result = service.me();
    expect(result).toEqual("id");
  });
});
