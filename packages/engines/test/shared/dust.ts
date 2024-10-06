import fs from "fs";
import {join} from "path";

import {engines, requires} from "../../src/index.js";

const rootDir = join(import.meta.dirname, "..");

export function test(name: string) {
  const user = {name: "Tobi"};

  describe(name, () => {
    // Use case: return upper case string.
    it("should support fetching template name from the context", async () => {
      const viewsDir = `${rootDir}/fixtures/${name}`;
      const templatePath = `${viewsDir}/user_template_name.${name}`;
      const str = fs.readFileSync(templatePath).toString();

      const locals = {
        user: user,
        views: viewsDir,
        filename: templatePath
      };

      if (name === "dust") {
        const dust = require("dustjs-helpers");
        dust.helpers.templateName = (chunk: any, context: any) => {
          return chunk.write(context.getTemplateName());
        };

        requires.set("dust", dust);
      }

      const html = await engines.get(name)!.render(str, locals);
      expect(html).toEqual("<p>Tobi</p>user_template_name");
    });
  });
}
