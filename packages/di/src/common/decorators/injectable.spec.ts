import {Provider} from "../domain/Provider.js";
import {Injectable} from "./injectable.js";

describe("@Injectable()", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should call `registerProvider` setting `token` according to the target class", () => {
    // GIVEN
    class Test {}

    // WHEN
    Injectable()(Test);

    // THEN
    expect(Provider.Registry.get(Test)?.useClass).toEqual(Test);
  });

  it("should call `registerProvider` passing an additional options", () => {
    // GIVEN
    class Test {}

    // WHEN
    Injectable({options: "options"})(Test);

    // THEN
    expect(Provider.Registry.get(Test)?.useClass).toEqual(Test);
    expect(Provider.Registry.get(Test)?.options).toEqual("options");
  });

  it("should override `token`", () => {
    // GIVEN
    class Test {}

    const token = "custom";

    // WHEN
    Injectable({token})(Test);

    // THEN
    expect(Provider.Registry.get("custom")?.useClass).toEqual(Test);
  });
});
