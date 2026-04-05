import {getHostInfoFromPort} from "@tsed/core";
import {configuration, constant} from "@tsed/di";

function httpPort() {
  return constant<string>("httpPort", constant("port"));
}

export function setHttpPort(settings: {address: string; port: number}) {
  configuration().set("httpPort", `${settings.address}:${settings.port}`);
}

export function setHttpsPort(settings: {address: string; port: number}) {
  configuration().set("httpsPort", `${settings.address}:${settings.port}`);
}

export function getHttpsPort() {
  return getHostInfoFromPort("https", constant<string>("httpsPort"));
}

export function getHttpPort() {
  return getHostInfoFromPort("http", httpPort());
}

export function getBestHost() {
  if (constant<string>("httpsPort")) {
    return getHttpsPort();
  }

  if (httpPort()) {
    return getHttpPort();
  }

  return {
    toString() {
      return "/";
    }
  };
}

declare global {
  namespace TsED {
    interface Configuration {
      readonly getBestHost: typeof getBestHost;
      readonly getHttpPort: typeof getHttpPort;
      readonly getHttpsPort: typeof getHttpsPort;
      readonly setHttpsPort: typeof setHttpsPort;
      readonly setHttpPort: typeof setHttpPort;
    }
  }
}

configuration().decorate("getBestHost", getBestHost);
configuration().decorate("getHttpPort", getHttpPort);
configuration().decorate("getHttpsPort", getHttpsPort);
configuration().decorate("setHttpsPort", setHttpsPort as (...args: unknown[]) => unknown);
configuration().decorate("setHttpPort", setHttpPort as (...args: unknown[]) => unknown);
