import {expect} from "chai";
import {getHostInfoFromPort} from "./getHostInfoFromPort";

describe("buildAddressAndPort()", () => {
  it("should return address and port from a concatened address and port", () => {
    const address = getHostInfoFromPort("http", "0.0.0.0:9000");
    expect(address).to.deep.eq({
      address: "0.0.0.0",
      port: 9000,
      protocol: "http",
      toString: address.toString
    });
  });

  it("should return address and port from a port number", () => {
    const address = getHostInfoFromPort("https", 9000);
    expect(address).to.deep.eq({
      address: "0.0.0.0",
      port: 9000,
      protocol: "https",
      toString: address.toString
    });

    expect(address.toString()).to.eq("https://0.0.0.0:9000");
  });
});
