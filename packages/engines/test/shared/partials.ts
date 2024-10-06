import fs from "fs";
import {join} from "path";

import {engines} from "../../src/index.js";

const rootDir = join(import.meta.dirname, "..");

const readFile = fs.readFile;
const readFileSync = fs.readFileSync;

export function test(name: string) {
  const user = {name: "Tobi"};
  const engine = engines.get(name)!;

  describe(name, () => {
    afterEach(function () {
      fs.readFile = readFile;
      fs.readFileSync = readFileSync;
    });

    if (name === "dust") {
      it("should support rendering a partial", async () => {
        const str = fs.readFileSync(`${rootDir}/fixtures/${name}/user_partial.${name}`).toString();
        const locals = {
          user: user,
          views: `${rootDir}/fixtures/${name}`
        };
        const html = await engine.render(str, locals);

        expect(html).toEqual("<p>Tobi from partial!</p><p>Tobi</p>");
      });
    } else {
      it("should support partials", async () => {
        const path = `${rootDir}/fixtures/${name}/partials.${name}`;
        const locals = {user: user, partials: {partial: "user"}};
        const html = await engine.renderFile(path, locals);
        expect(html).toEqual("<p>Tobi</p>");
      });
      it("should support absolute path partial", async () => {
        const path = `${rootDir}/fixtures/${name}/partials.${name}`;
        const locals = {user: user, partials: {partial: join(import.meta.dirname, "/../../test/fixtures/", name, "/user")}};
        const html = await engine.renderFile(path, locals);
        expect(html).toEqual("<p>Tobi</p>");
      });
      it("should support relative path partial", async () => {
        const path = `${rootDir}/fixtures/${name}/partials.${name}`;
        const locals = {user: user, partials: {partial: "../" + name + "/user"}};
        const html = await engine.renderFile(path, locals);
        expect(html).toEqual("<p>Tobi</p>");
      });
    }
  });
}
