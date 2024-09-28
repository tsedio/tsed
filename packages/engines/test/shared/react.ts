import fs from "fs";
import {join} from "path";

import {engines} from "../../src/index.js";

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
    beforeEach(() => {
      fs.readFile = readFile;
      fs.readFileSync = readFileSync;
    });

    it("should support locals", async () => {
      const path = `${rootDir}/fixtures/${name}/user.${name}`;
      const locals = {user: user};
      const {engine} = await getEngineFixture(name);
      const html = await engine.renderFile(path, locals);

      expect(html).toEqual("<p>Tobi</p>");
    });

    it("should support promises", async () => {
      const path = `${rootDir}/fixtures/${name}/user.${name}`;
      const locals = {user: user};
      const {engine} = await getEngineFixture(name);
      const html = await engine.renderFile(path, locals);

      expect(html).toEqual("<p>Tobi</p>");
    });

    it("should support rendering a string", async () => {
      const str = fs.readFileSync(`${rootDir}/fixtures/${name}/user.${name}`).toString();
      const locals = {user: user};
      const {engine} = await getEngineFixture(name);
      const html = await engine.render(str, locals);
      expect(html).toEqual("<p>Tobi</p>");
    });

    it("should support rendering into a base template", async () => {
      const path = `${rootDir}/fixtures/${name}/user.${name}`;
      const locals = {
        user: user,
        base: `${rootDir}/fixtures/${name}/base.html`,
        title: "My Title"
      };
      const {engine} = await getEngineFixture(name);
      const html = await engine.renderFile(path, locals);
      expect(html).toEqual("<html><head><title>My Title</title></head><body><p>Tobi</p></body></html>");
    });
  });
}
