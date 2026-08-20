import {createExpressRequestAccessors} from "./createExpressRequestAccessors.js";

describe("createExpressRequestAccessors", () => {
  it("exposes values produced by Express middleware", () => {
    const request = {
      body: {name: "widget"},
      rawBody: Buffer.from("widget"),
      cookies: {theme: "dark"},
      params: {id: "1"},
      session: {user: "romain"},
      files: [{name: "avatar"}],
      accepts: vi.fn().mockReturnValue("application/json")
    };

    const accessors = createExpressRequestAccessors(request as any);

    expect(accessors.body?.()).toEqual({name: "widget"});
    expect(accessors.rawBody?.()).toEqual(Buffer.from("widget"));
    expect(accessors.cookies?.()).toEqual({theme: "dark"});
    expect(accessors.params?.()).toEqual({id: "1"});
    expect(accessors.session?.()).toEqual({user: "romain"});
    expect(accessors.files?.()).toEqual([{name: "avatar"}]);
    expect(accessors.accepts?.("application/json")).toBe("application/json");
  });
});
