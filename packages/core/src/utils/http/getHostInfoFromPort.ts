/**
 * Parses an address-port combination and returns host information with protocol.
 *
 * Accepts either a numeric port or a string in the format "address:port".
 * Returns an object with protocol, address, port, and a toString method for URL formatting.
 *
 * @public
 * @since v7.0.0
 */
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

/**
 * Type alias for the return value of {@link getHostInfoFromPort}.
 *
 * @public
 * @since v7.0.0
 */
export type ReturnHostInfoFromPort = ReturnType<typeof getHostInfoFromPort>;
