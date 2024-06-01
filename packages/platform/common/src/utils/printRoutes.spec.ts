import {printRoutes} from "./printRoutes.js";

describe("printRoutes()", () => {
  it("should return routes", () => {
    const routes = [
      {
        method: "GET",
        url: "/",
        name: "name",
        toJSON() {
          return this;
        }
      }
    ];

    // tslint:disable-next-line: no-unused-variable
    expect(typeof printRoutes(routes as any)).toBe("string");
  });
});
