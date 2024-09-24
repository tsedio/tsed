import fs from "fs";
import {join} from "path";

import {engines, requires} from "../../src/index.js";

const rootDir = join(import.meta.dirname, "..");

const readFile = fs.readFile;
const readFileSync = fs.readFileSync;

async function getEngineFixture(name: string) {
  const engine = engines.get(name)!;
  await engine.$onInit();

  return {engine};
}

export function test(name: string) {
  const user = {name: "Tobi"};

  describe(name, () => {
    afterEach(() => {
      fs.readFile = readFile;
      fs.readFileSync = readFileSync;
    });

    it("should support locals", async () => {
      const {engine} = await getEngineFixture(name);
      const path = `${rootDir}/fixtures/${name}/user.${name}`;
      const locals = {user: user};

      const html = await engine.renderFile(path, locals);
      expect(html).toMatch(/Tobi/);
    });

    it("should not cache by default", async () => {
      const path = `${rootDir}/fixtures/${name}/user.${name}`;
      const locals = {user: user};
      let calls = 0;

      fs.readFileSync = function (...args) {
        ++calls;
        return readFileSync.call(this, ...args);
      };

      // @ts-ignore
      fs.readFile = function (...args) {
        ++calls;
        readFile.call(this, ...args);
      };
      const {engine} = await getEngineFixture(name);
      const html = await engine.renderFile(path, locals);
      expect(html).toMatch(/Tobi/);

      await engine.renderFile(path, locals);

      expect(html).toMatch(/Tobi/);
    });

    it("should support rendering a string", async () => {
      const str = fs.readFileSync(`${rootDir}/fixtures/${name}/user.${name}`).toString();
      const locals = {user: user};
      const {engine} = await getEngineFixture(name);
      const html = await engine.render(str, locals);
      expect(html).toMatch(/Tobi/);
    });

    it("should be exposed in the requires object", function () {
      expect(!!requires.get(name)).toBeTruthy();
    });
  });
}
