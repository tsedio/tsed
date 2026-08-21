import {createKoaRequestAccessors} from "./createKoaRequestAccessors.js";

describe("createKoaRequestAccessors", () => {
  it("exposes values produced by Koa middleware without parsing the body", () => {
    const rawBody = Buffer.from("widget");
    const context = {
      params: {id: "1"},
      session: {user: "romain"},
      request: {
        body: {name: "widget"},
        rawBody,
        files: [{name: "avatar"}]
      },
      accepts: vi.fn().mockReturnValue("application/json")
    };

    const accessors = createKoaRequestAccessors(context as any);

    expect(accessors.body?.()).toEqual({name: "widget"});
    expect(accessors.rawBody?.()).toBe(rawBody);
    expect(accessors.params?.()).toEqual({id: "1"});
    expect(accessors.session?.()).toEqual({user: "romain"});
    expect(accessors.files?.()).toEqual([{name: "avatar"}]);
    expect(accessors.accepts?.("application/json")).toBe("application/json");
  });
});
