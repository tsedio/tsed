import {isArray} from "@tsed/core";

function getProtocolName(req: any) {
  const {query = {}, params = {}, body = {}} = req;

  return params.protocol || query.protocol || body.protocol;
}

export function getProtocolsFromRequest(req: any, protocol: string | string[], defaultProtocols: string[]): string[] {
  if (!isArray(protocol)) {
    if (protocol === "*") {
      return defaultProtocols;
    }

    const protocolReq = getProtocolName(req);

    if (protocol === ":protocol") {
      return [protocolReq].filter(Boolean);
    }

    if (protocolReq && protocolReq !== protocol) {
      return [];
    }

    return [protocol];
  }

  const protocols: string[] = protocol;

  if (protocols.includes("*")) {
    return defaultProtocols;
  }

  return protocols;
}
