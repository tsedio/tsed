import {engines} from "../../src/index";
import filedirname from "filedirname";
import fs from "fs";
import {expect} from "chai";
import {join} from "path";

// FIXME remove when esm is ready
const [, dir] = filedirname();
const rootDir = join(dir, "..");

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
      expect(html).to.equal("TOBI");
    });
  });
}
