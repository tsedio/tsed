export function getHostInfoFromPort(protocol: string, addressPort: any) {
  let address = "0.0.0.0";
  let port = addressPort;

  if (typeof addressPort === "string" && addressPort.indexOf(":") > -1) {
    [address, port] = addressPort.split(":");
    port = +port;
  }

  return {
    protocol,
    address,
    port: port as number,
    toString() {
      return [`${this.protocol}://${this.address}`, typeof this.port === "number" && this.port].filter(Boolean).join(":");
    }
  };
}

export type ReturnHostInfoFromPort = ReturnType<typeof getHostInfoFromPort>;
