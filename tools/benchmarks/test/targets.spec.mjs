import {describe, expect, it} from "vitest";

import {THIRD_PARTY} from "../src/deps.mjs";
import {createManifest, findRegistryPackages, localPackages, parseTarget, REPO_DIR} from "../src/targets.mjs";
import {dependencyClosure} from "../src/workspace.mjs";

describe("targets", () => {
  describe("parseTarget()", () => {
    it("should parse a published version", () => {
      expect(parseTarget("8.44.1")).toEqual({name: "8.44.1", kind: "version", version: "8.44.1"});
      expect(parseTarget("8.45.0-beta.1")).toMatchObject({kind: "version"});
    });

    it("should parse the current checkout", () => {
      expect(parseTarget("local")).toEqual({name: "local", kind: "local", repoDir: REPO_DIR});
    });

    it("should parse a named checkout", () => {
      expect(parseTarget("local-base", {"local-base": "/tmp/base"})).toEqual({name: "local-base", kind: "local", repoDir: "/tmp/base"});
    });

    it("should require the directory of a named checkout", () => {
      expect(() => parseTarget("local-base")).toThrow("--local-dir local-base=<path>");
    });

    it("should reject an unknown target", () => {
      expect(() => parseTarget("latest")).toThrow('Unknown target "latest"');
    });
  });

  describe("createManifest()", () => {
    it("should pin the @tsed/* packages of a version and the shared third-party versions", () => {
      const manifest = createManifest({name: "8.44.1", tsed: {"@tsed/core": "8.44.1", "@tsed/platform-express": "8.44.1"}});

      expect(manifest.dependencies["@tsed/core"]).toBe("8.44.1");
      expect(manifest.dependencies.express).toBe(THIRD_PARTY.express);
      expect(manifest.dependencies.fastify).toBe(THIRD_PARTY.fastify);
    });

    it("should write every dependency as an override, so transitive ranges resolve to the same version", () => {
      const manifest = createManifest({name: "8.44.1", tsed: {"@tsed/core": "8.44.1"}});

      expect(manifest.overrides).toEqual(manifest.dependencies);
    });

    it("should give two targets the same third-party versions", () => {
      const a = createManifest({name: "8.44.1", tsed: {"@tsed/core": "8.44.1"}});
      const b = createManifest({name: "local", tsed: {"@tsed/core": "file:/tmp/tsed-core.tgz"}});
      const thirdParty = (manifest) => Object.entries(manifest.dependencies).filter(([name]) => !name.startsWith("@tsed/core"));

      expect(thirdParty(a)).toEqual(thirdParty(b));
    });
  });

  describe("localPackages()", () => {
    it("should point every @tsed/* package to its tarball", () => {
      expect(localPackages(["@tsed/core", "@tsed/platform-http"], "/tmp/tarballs")).toEqual({
        "@tsed/core": "file:/tmp/tarballs/tsed-core.tgz",
        "@tsed/platform-http": "file:/tmp/tarballs/tsed-platform-http.tgz"
      });

      const manifest = createManifest({name: "local", tsed: localPackages(["@tsed/core"], "/tmp/tarballs")});

      expect(manifest.overrides["@tsed/core"]).toBe("file:/tmp/tarballs/tsed-core.tgz");
    });
  });

  describe("findRegistryPackages()", () => {
    it("should list the @tsed/* packages installed from the registry", () => {
      const lockfile = {
        packages: {
          "": {name: "bench-target-local"},
          "node_modules/@tsed/core": {version: "8.17.0", resolved: "file:tarballs/tsed-core.tgz"},
          "node_modules/@tsed/platform-http/node_modules/@tsed/di": {
            version: "8.17.0",
            resolved: "https://registry.npmjs.org/@tsed/di/-/di-8.17.0.tgz"
          },
          "node_modules/@tsed/logger": {version: "8.0.4", resolved: "https://registry.npmjs.org/@tsed/logger/-/logger-8.0.4.tgz"}
        }
      };

      expect(findRegistryPackages(lockfile, ["@tsed/core", "@tsed/di"])).toEqual([
        "node_modules/@tsed/platform-http/node_modules/@tsed/di@8.17.0 (https://registry.npmjs.org/@tsed/di/-/di-8.17.0.tgz)"
      ]);
    });
  });

  describe("dependencyClosure()", () => {
    it("should follow dependencies and peer dependencies, and keep non-workspace packages apart", () => {
      const workspaces = new Map([
        ["@tsed/platform-express", {pkg: {peerDependencies: {"@tsed/platform-http": ">=8", express: ">=4"}}}],
        ["@tsed/platform-http", {pkg: {dependencies: {"@tsed/core": "workspace:*", "@tsed/logger": "^8"}}}],
        ["@tsed/core", {pkg: {}}],
        ["@tsed/unused", {pkg: {}}]
      ]);

      expect(dependencyClosure(workspaces, ["@tsed/platform-express"])).toEqual({
        internal: ["@tsed/core", "@tsed/platform-express", "@tsed/platform-http"],
        external: ["@tsed/logger"]
      });
    });
  });
});
