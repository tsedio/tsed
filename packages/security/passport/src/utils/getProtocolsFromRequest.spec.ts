import {getProtocolsFromRequest} from "./getProtocolsFromRequest.js";

describe("getProtocolsFromRequest", () => {
  it("should allow all protocol (from default protocols)", () => {
    const defaultProtocols = ["default"];
    const req = {};
    const result = getProtocolsFromRequest(req, "*", defaultProtocols);

    expect(result).toEqual(["default"]);
  });

  it("should allow all protocol (from default protocols - array)", () => {
    const defaultProtocols = ["default"];
    const req = {};
    const result = getProtocolsFromRequest(req, ["*"], defaultProtocols);

    expect(result).toEqual(["default"]);
  });

  it("should return providers", () => {
    const defaultProtocols = ["default"];
    const req = {};
    const result = getProtocolsFromRequest(req, ["basic", "local"], defaultProtocols);

    expect(result).toEqual(["basic", "local"]);
  });

  it("should get protocol from request (params)", () => {
    const defaultProtocols = ["default"];
    const req = {
      params: {
        protocol: "basic"
      }
    };
    const result = getProtocolsFromRequest(req, ":protocol", defaultProtocols);

    expect(result).toEqual(["basic"]);
  });

  it("should not get protocol from request", () => {
    const defaultProtocols = ["default"];
    const req = {
      params: {}
    };
    const result = getProtocolsFromRequest(req, ":protocol", defaultProtocols);

    expect(result).toEqual([]);
  });

  it("should get protocol from request (query)", () => {
    const defaultProtocols = ["default"];
    const req = {
      query: {
        protocol: "basic"
      }
    };
    const result = getProtocolsFromRequest(req, ":protocol", defaultProtocols);

    expect(result).toEqual(["basic"]);
  });

  it("should get protocol from request (body)", () => {
    const defaultProtocols = ["default"];
    const req = {
      body: {
        protocol: "basic"
      }
    };
    const result = getProtocolsFromRequest(req, ":protocol", defaultProtocols);

    expect(result).toEqual(["basic"]);
  });

  it("should return basic protocol", () => {
    const defaultProtocols = ["default"];
    const req = {
      params: {
        protocol: "basic"
      }
    };
    const result = getProtocolsFromRequest(req, "basic", defaultProtocols);

    expect(result).toEqual(["basic"]);
  });

  it("should not return protocol when protocol doesn't match", () => {
    const defaultProtocols = ["default"];
    const req = {
      params: {
        protocol: "basic"
      }
    };
    const result = getProtocolsFromRequest(req, "other", defaultProtocols);

    expect(result).toEqual([]);
  });
});
