import {PlatformResponseDraft} from "../index.js";

describe("PlatformResponseDraft", () => {
  it("should finalize mutable state as a Fetch response", async () => {
    const draft = new PlatformResponseDraft();

    draft.setStatus(201).setHeader("x-request-id", "request-id").json({created: true});

    const response = draft.finalize();

    expect(response.status).toBe(201);
    expect(response.headers.get("x-request-id")).toBe("request-id");
    expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8");
    await expect(response.json()).resolves.toEqual({created: true});
  });

  it("should preserve repeated headers", () => {
    const draft = new PlatformResponseDraft();

    draft.appendHeader("set-cookie", "first=value").appendHeader("set-cookie", "second=value");

    expect(draft.finalize().headers.get("set-cookie")).toContain("first=value");
  });

  it("should reject mutations after finalization", () => {
    const draft = new PlatformResponseDraft();

    draft.finalize();

    expect(() => draft.setStatus(204)).toThrow("PlatformResponseDraft has already been finalized");
  });
});
