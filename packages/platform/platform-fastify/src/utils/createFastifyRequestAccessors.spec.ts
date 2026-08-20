import {createFastifyRequestAccessors} from "./createFastifyRequestAccessors.js";

describe("createFastifyRequestAccessors", () => {
  it("exposes values produced by Fastify plugins", () => {
    const request = {
      body: {name: "widget"},
      rawBody: Buffer.from("widget"),
      cookies: {theme: "dark"},
      params: {id: "1"},
      session: {user: "romain"},
      files: [{name: "avatar"}],
      accepts: vi.fn().mockReturnValue("application/json")
    };

    const accessors = createFastifyRequestAccessors(request as any);

    expect(accessors.body?.()).toEqual({name: "widget"});
    expect(accessors.rawBody?.()).toEqual(Buffer.from("widget"));
    expect(accessors.cookies?.()).toEqual({theme: "dark"});
    expect(accessors.params?.()).toEqual({id: "1"});
    expect(accessors.session?.()).toEqual({user: "romain"});
    expect(accessors.files?.()).toEqual([{name: "avatar"}]);
    expect(accessors.accepts?.("application/json")).toBe("application/json");
  });
});
