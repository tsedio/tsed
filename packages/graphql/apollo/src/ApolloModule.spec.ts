import {InjectorService} from "@tsed/di";
import {Logger} from "@tsed/logger";
import {PlatformConfiguration} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";

import {ApolloModule} from "./ApolloModule.js";
import type {ApolloSettings} from "./interfaces/ApolloSettings.js";
import {ApolloService} from "./services/ApolloService.js";

describe("ApolloModule", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("settings", () => {
    it("should return apollo settings", () => {
      const module = PlatformTest.get<ApolloModule>(ApolloModule);
      const configuration = PlatformTest.get<PlatformConfiguration>(PlatformConfiguration);

      const apolloSettings = {server1: {path: "/graphql"}};
      vi.spyOn(configuration, "get").mockReturnValue(apolloSettings);

      expect(module.settings).toEqual(apolloSettings);
    });

    it("should fallback to graphql settings", () => {
      const module = PlatformTest.get<ApolloModule>(ApolloModule);
      const configuration = PlatformTest.get<PlatformConfiguration>(PlatformConfiguration);

      const graphqlSettings = {server1: {path: "/graphql"}};
      vi.spyOn(configuration, "get").mockImplementation((key: string, defaultValue?: any) => {
        if (key === "apollo") return defaultValue;
        if (key === "graphql") return graphqlSettings;
        return defaultValue;
      });

      expect(module.settings).toEqual(graphqlSettings);
    });

    it("should fallback to typegraphql settings", () => {
      const module = PlatformTest.get<ApolloModule>(ApolloModule);
      const configuration = PlatformTest.get<PlatformConfiguration>(PlatformConfiguration);

      const typegraphqlSettings = {server1: {path: "/graphql"}};
      vi.spyOn(configuration, "get").mockImplementation((key: string, defaultValue?: any) => {
        if (key === "apollo") return defaultValue;
        if (key === "graphql") return defaultValue;
        if (key === "typegraphql") return typegraphqlSettings;
        return defaultValue;
      });

      expect(module.settings).toEqual(typegraphqlSettings);
    });

    it("should return undefined when no settings configured", () => {
      const module = PlatformTest.get<ApolloModule>(ApolloModule);
      const configuration = PlatformTest.get<PlatformConfiguration>(PlatformConfiguration);

      vi.spyOn(configuration, "get").mockReturnValue(undefined);

      expect(module.settings).toBeUndefined();
    });
  });

  describe("$onRoutesInit()", () => {
    it("should create Apollo servers based on settings", async () => {
      const module = PlatformTest.get<ApolloModule>(ApolloModule);
      const service = PlatformTest.get<ApolloService>(ApolloService);
      const configuration = PlatformTest.get<PlatformConfiguration>(PlatformConfiguration);
      const injector = PlatformTest.get<InjectorService>(InjectorService);

      const settings = {
        server1: {path: "/graphql1"} as ApolloSettings,
        server2: {path: "/graphql2"} as ApolloSettings
      };

      vi.spyOn(configuration, "get").mockReturnValue(settings);
      const alterSpy = vi.spyOn(injector, "alterAsync").mockImplementation(async (event, options) => options);
      const createServerSpy = vi.spyOn(service, "createServer").mockResolvedValue(undefined as any);

      await module.$onRoutesInit();

      expect(alterSpy).toHaveBeenCalledTimes(2);
      expect(alterSpy).toHaveBeenCalledWith("$alterApolloSettings", {id: "server1", path: "/graphql1"});
      expect(alterSpy).toHaveBeenCalledWith("$alterApolloSettings", {id: "server2", path: "/graphql2"});

      expect(createServerSpy).toHaveBeenCalledTimes(2);
      expect(createServerSpy).toHaveBeenCalledWith("server1", {id: "server1", path: "/graphql1"});
      expect(createServerSpy).toHaveBeenCalledWith("server2", {id: "server2", path: "/graphql2"});
    });

    it("should handle altered settings", async () => {
      const module = PlatformTest.get<ApolloModule>(ApolloModule);
      const service = PlatformTest.get<ApolloService>(ApolloService);
      const configuration = PlatformTest.get<PlatformConfiguration>(PlatformConfiguration);
      const injector = PlatformTest.get<InjectorService>(InjectorService);

      const settings = {
        server1: {path: "/graphql"} as ApolloSettings
      };

      vi.spyOn(configuration, "get").mockReturnValue(settings);
      const alterSpy = vi
        .spyOn(injector, "alterAsync")
        .mockResolvedValue({id: "server1", path: "/graphql", schema: "altered-schema"} as any);
      const createServerSpy = vi.spyOn(service, "createServer").mockResolvedValue(undefined as any);

      await module.$onRoutesInit();

      expect(createServerSpy).toHaveBeenCalledWith("server1", {id: "server1", path: "/graphql", schema: "altered-schema"});
    });

    it("should do nothing when no settings configured", async () => {
      const module = PlatformTest.get<ApolloModule>(ApolloModule);
      const service = PlatformTest.get<ApolloService>(ApolloService);
      const configuration = PlatformTest.get<PlatformConfiguration>(PlatformConfiguration);

      vi.spyOn(configuration, "get").mockReturnValue(undefined);
      const createServerSpy = vi.spyOn(service, "createServer").mockResolvedValue(undefined as any);

      await module.$onRoutesInit();

      expect(createServerSpy).not.toHaveBeenCalled();
    });
  });

  describe("$afterListen()", () => {
    it("should log Apollo server URLs", () => {
      const module = PlatformTest.get<ApolloModule>(ApolloModule);
      const logger = PlatformTest.get<Logger>(Logger);
      const configuration = PlatformTest.get<PlatformConfiguration>(PlatformConfiguration);

      vi.spyOn(configuration, "getBestHost").mockReturnValue({
        protocol: "http",
        address: "localhost",
        port: 8080
      } as any);

      const settings = {
        server1: {path: "/graphql"} as ApolloSettings,
        server2: {path: "/api/graphql"} as ApolloSettings
      };

      vi.spyOn(configuration, "get").mockReturnValue(settings);
      const infoSpy = vi.spyOn(logger, "info");

      module.$afterListen();

      expect(infoSpy).toHaveBeenCalledTimes(2);
      expect(infoSpy).toHaveBeenCalledWith("[server1] Apollo server is available on http://localhost:8080/graphql");
      expect(infoSpy).toHaveBeenCalledWith("[server2] Apollo server is available on http://localhost:8080/api/graphql");
    });

    it("should handle paths with leading slash", () => {
      const module = PlatformTest.get<ApolloModule>(ApolloModule);
      const logger = PlatformTest.get<Logger>(Logger);
      const configuration = PlatformTest.get<PlatformConfiguration>(PlatformConfiguration);

      vi.spyOn(configuration, "getBestHost").mockReturnValue({
        protocol: "https",
        address: "0.0.0.0",
        port: 3000
      } as any);

      const settings = {
        server1: {path: "/graphql"} as ApolloSettings
      };

      vi.spyOn(configuration, "get").mockReturnValue(settings);
      const infoSpy = vi.spyOn(logger, "info");

      module.$afterListen();

      expect(infoSpy).toHaveBeenCalledWith("[server1] Apollo server is available on https://0.0.0.0:3000/graphql");
    });

    it("should handle host without port", () => {
      const module = PlatformTest.get<ApolloModule>(ApolloModule);
      const logger = PlatformTest.get<Logger>(Logger);
      const configuration = PlatformTest.get<PlatformConfiguration>(PlatformConfiguration);

      vi.spyOn(configuration, "getBestHost").mockReturnValue({
        protocol: "http",
        address: "localhost"
      } as any);

      const settings = {
        server1: {path: "/graphql"} as ApolloSettings
      };

      vi.spyOn(configuration, "get").mockReturnValue(settings);
      const infoSpy = vi.spyOn(logger, "info");

      module.$afterListen();

      expect(infoSpy).toHaveBeenCalledWith("[server1] Apollo server is available on /graphql");
    });

    it("should do nothing when no settings configured", () => {
      const module = PlatformTest.get<ApolloModule>(ApolloModule);
      const logger = PlatformTest.get<Logger>(Logger);
      const configuration = PlatformTest.get<PlatformConfiguration>(PlatformConfiguration);

      vi.spyOn(configuration, "getBestHost").mockReturnValue({
        protocol: "http",
        address: "localhost",
        port: 8080
      } as any);

      vi.spyOn(configuration, "get").mockReturnValue(undefined);
      const infoSpy = vi.spyOn(logger, "info");

      module.$afterListen();

      expect(infoSpy).not.toHaveBeenCalled();
    });
  });
});
