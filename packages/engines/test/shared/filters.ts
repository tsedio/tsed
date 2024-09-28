import fs from "fs";
import {join} from "path";

import {engines} from "../../src/index.js";

const rootDir = join(import.meta.dirname, "..");

export function test(name: string) {
  const engine = engines.get(name)!;
  const user = {name: "Tobi"};

  describe(name, () => {
    // Use case: return upper case string.
    it("should support filters", async () => {
      const str = fs.readFileSync(`${rootDir}/fixtures/${name}/filters.${name}`).toString();

      const locals = {
        user: user,
        filters: {
          toupper(object: any) {
            return object.toUpperCase();
          }
        }
      };

      const html = await engine.render(str, locals);
      expect(html).toEqual("TOBI");
    });
  });
}
