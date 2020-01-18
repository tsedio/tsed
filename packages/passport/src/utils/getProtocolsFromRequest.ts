function getProtocolName(req: any) {
  const {query = {}, params = {}, body = {}} = req;

  return params.protocol || query.protocol || body.protocol;
}

const add = (protocols: string[], protocol: string): string[] => {
  if (!protocol || protocols.includes(protocol)) {
    return protocols;
  }

  return protocols.concat(protocol);
};

export function getProtocolsFromRequest(req: any, protocol: string | string[], defaultProtocols: string[]): string[] {
  let protocols: string[] = [].concat(protocol as never);

  if (protocols.includes("*")) {
    return defaultProtocols;
  }

  protocols = protocols.reduce((protocols: string[], protocol: string) => {
    if (protocol === ":protocol") {
      return add(protocols, getProtocolName(req));
    }

    if (protocol === getProtocolName(req)) {
      return add(protocols, protocol);
    }

    return protocols;
  }, [] as string[]);

  return protocols;
}
