import {getEngineFixture} from "../../test/getEngineFixture.js";
import {PugEngine} from "./PugEngine.js";

describe("PugEngine", () => {
  it("should render the given content (by string - no cache)", async () => {
    const {render, locals, $compile, template} = await getEngineFixture({token: PugEngine});
    await render();

    expect(await render()).toEqual("<p>Tobi</p>");
    expect($compile()).toHaveBeenCalledTimes(2);
    expect($compile()).toHaveBeenCalledWith(template, {...locals, cache: false});
  });
  it("should render the given content (by string - with cache)", async () => {
    const {render, locals, $compile, template} = await getEngineFixture({token: PugEngine, cache: true});
    await render();

    expect(await render()).toEqual("<p>Tobi</p>");
    expect($compile()).toHaveBeenCalledTimes(2);
    expect($compile()).toHaveBeenCalledWith(template, {...locals, cache: true});
  });
  it("should render the given content (by file - no cache)", async () => {
    const {renderFile, locals, $compileFile, path} = await getEngineFixture({token: PugEngine});
    await renderFile();
    const content = await renderFile();

    expect(content).toEqual("<p>Tobi</p>");
    expect($compileFile()).toHaveBeenCalledTimes(2);
    expect($compileFile()).toHaveBeenCalledWith(path, {
      ...locals,
      partials: undefined,
      filename: path,
      cache: false
    });
  });
  it("should render the given content (by file - with cache)", async () => {
    const {renderFile, locals, $compileFile, path} = await getEngineFixture({token: PugEngine, cache: true});

    await renderFile();
    const content = await renderFile();

    expect(content).toEqual("<p>Tobi</p>");
    expect($compileFile()).toHaveBeenCalledTimes(1);
    expect($compileFile()).toHaveBeenCalledWith(path, {
      ...locals,
      partials: undefined,
      filename: path,
      cache: true
    });
  });
});
