import fs from "fs";
import handlebars from "handlebars";
import {join} from "path";

import {engines} from "../../src/index.js";

const Sqrl = require("squirrelly");

const rootDir = join(import.meta.dirname, "..");

const readFile = fs.readFile;
const readFileSync = fs.readFileSync;

export function test(name: string) {
  const engine = engines.get(name)!;

  describe(name, () => {
    let user: any;

    afterEach(() => {
      fs.readFile = readFile;
      fs.readFileSync = readFileSync;
    });

    if (name === "handlebars") {
      user = {name: "<strong>Tobi</strong>"};

      // Use case: return safe HTML that won’t be escaped in the final render.
      it("should support helpers", async () => {
        const str = fs.readFileSync(`${rootDir}/fixtures/${name}/helpers.${name}`).toString();

        const locals = {
          user: user,
          helpers: {
            safe(object: any) {
              return new handlebars.SafeString(object);
            }
          }
        };

        const html = await engine.render(str, locals);
        expect(html).toEqual("<strong>Tobi</strong>");
      });
    } else if (name === "squirrelly") {
      user = {name: "<strong>Tobi</strong>"};

      // Use case: return safe HTML that won’t be escaped in the final render.
      it("should support helpers", async () => {
        const str = fs.readFileSync(`${rootDir}/fixtures/${name}/helpers.${name}`).toString();

        Sqrl.defineHelper("myhelper", (args: string[], content: any, blocks: any) => {
          return args[0].slice(1, -1);
        });

        const options = {user: user};

        const html = await engine.render(str, options);
        expect(html).toEqual("strong>Tobi</strong");
      });
    }

    if (name === "vash") {
      user = {name: "Tobi"};

      // See this for Vash helper system : https://github.com/kirbysayshi/vash#helper-system
      // Use case: return as lower case
      it("should support helpers", async () => {
        const str = fs.readFileSync(`${rootDir}/fixtures/${name}/helpers.${name}`).toString();
        const locals = {
          user: user,
          helpers: {
            lowerCase(text: string) {
              return text.toLowerCase();
            }
          }
        };

        const html = await engine.render(str, locals);
        expect(html).toEqual("<strong>tobi</strong>");
      });
    }
  });
}
