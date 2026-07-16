import {getBestHost, getHttpPort, getHttpsPort, setHttpPort, setHttpsPort} from "./getBestHost.js";
import {configuration} from "@tsed/di";

describe("getBestHost()", () => {
  it("should return the best host", () => {
    setHttpsPort({address: "address", port: 8080});

    const info = getHttpsPort();

    expect(info).toEqual({
      protocol: "https",
      address: "address",
      port: 8080,
      toString: info.toString
    });

    expect(getBestHost().toString()).toEqual("https://address:8080");
  });
  it("should return httpPort multiple usecase", () => {
    setHttpPort({address: "address", port: 8081});
    setHttpsPort({address: "address", port: 8080});

    const info = getHttpPort();

    expect(info).toEqual({
      protocol: "http",
      address: "address",
      port: 8081,
      toString: info.toString
    });

    expect(configuration().getBestHost().toString()).toEqual("https://address:8080");

    configuration().set("httpsPort", false);

    expect(configuration().getBestHost().toString()).toEqual("http://address:8081");

    configuration().set("httpPort", false);

    expect(configuration().getBestHost().toString()).toEqual("/");
  });
});
