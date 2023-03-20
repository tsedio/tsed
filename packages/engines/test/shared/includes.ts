import {engines} from "../../src/index";
import fs from "fs";
import {expect} from "chai";
import {join} from "path";

const rootDir = join(__dirname, "..");

export function test(name: string) {
  const engine = engines.get(name)!;
  const user = {name: "Tobi"};

  describe(name, () => {
    it("should support includes", async () => {
      const str = fs.readFileSync(`${rootDir}/fixtures/${name}/include.${name}`).toString();
      const viewsDir = `${rootDir}/fixtures/${name}`;
      const locals: any = {user: user, settings: {views: viewsDir}};

      if (name === "liquid" || name === "arc-templates") {
        locals.includeDir = viewsDir;
      }

      const html = await engine.render(str, locals);

      if (name === "liquid") {
        expect(html).to.equal("<p>Tobi</p><section></section><footer></footer>");
      } else {
        expect(html).to.equal("<p>Tobi</p>");
      }
    });

    if (name === "nunjucks") {
      it("should support extending views", async () => {
        const str = fs.readFileSync(`${rootDir}/fixtures/${name}/layouts.${name}`).toString();
        const locals = {user: user, settings: {views: `${rootDir}/fixtures/${name}`}};

        const html = await engine.render(str, locals);
        expect(html).to.equal("<header></header><p>Tobi</p><footer></footer>");
      });
    }
  });
}
