import fs from "fs";

import {Engine} from "../src/components/Engine.js";
import {engines} from "../src/index.js";

const rootDir = import.meta.dirname; // automatically replaced by import.meta.dirname on build

interface EngineFixtureOptions {
  token: string | typeof Engine;
  cache?: boolean;
  templateName?: string;
}

export async function getEngineFixture({token, cache = false, templateName = "user"}: EngineFixtureOptions) {
  const engine = engines.get(token)!;

  await engine.$onInit();

  const name = engine.name;
  const path = `${rootDir}/fixtures/${name}/${templateName}.${name}`;
  const template = fs.readFileSync(path, {encoding: "utf8"});
  const locals = {
    user: {name: "Tobi"}
  };

  try {
    // @ts-ignore
    engine.$compile.restore();
    // @ts-ignore
    engine.$compileFile.restore();
  } catch (er) {}
  vi.spyOn(engine as any, "$compile");
  vi.spyOn(engine as any, "$compileFile");

  return {
    name,
    rootDir,
    template,
    path,
    engine,
    locals,
    // @ts-ignore
    $compile: () => engine.$compile,
    // @ts-ignore
    $compileFile: () => engine.$compileFile,
    render(options: any = {}) {
      return engine.render(template, {
        cache,
        ...locals,
        ...options
      });
    },
    renderFile(options: any = {}) {
      return engine.renderFile(path, {
        cache,
        ...locals,
        ...options
      });
    }
  };
}
