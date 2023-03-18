import filedirname from "filedirname";
import fs from "fs";
import sinon from "sinon";

import {Engine} from "../src/components/Engine";
import {engines} from "../src/index";

// FIXME remove when esm is ready
const [, rootDir] = filedirname();

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
  sinon.spy(engine as any, "$compile");
  sinon.spy(engine as any, "$compileFile");

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
