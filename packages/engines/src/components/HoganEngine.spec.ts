import {join} from "path";

import {getEngineFixture} from "../../test/getEngineFixture.js";
import {HoganEngine} from "./HoganEngine.js";

describe("HoganEngine", () => {
  it("should render the given content (by string - no cache)", async () => {
    const {render, locals, $compile, template} = await getEngineFixture({token: HoganEngine});
    await render();

    expect(await render()).toEqual("<p>Tobi</p>");
    expect($compile()).toHaveBeenCalledTimes(2);
    expect($compile()).toHaveBeenCalledWith(template, {...locals, cache: false});
  });
  it("should render the given content (by string - with cache)", async () => {
    const {render, locals, $compile, template} = await getEngineFixture({token: HoganEngine, cache: true});
    await render();

    expect(await render()).toEqual("<p>Tobi</p>");
    expect($compile()).toHaveBeenCalledTimes(2);
    expect($compile()).toHaveBeenCalledWith(template, {...locals, cache: true});
  });
  it("should render the given content (by file - no cache)", async () => {
    const {renderFile, locals, $compile, path, template} = await getEngineFixture({token: HoganEngine});
    await renderFile();
    const content = await renderFile();

    expect(content).toEqual("<p>Tobi</p>");
    expect($compile()).toHaveBeenCalledTimes(2);
    expect($compile()).toHaveBeenCalledWith(template, {
      ...locals,
      partials: undefined,
      filename: path,
      cache: false
    });
  });
  it("should render the given content (by file - with cache)", async () => {
    const {renderFile, locals, $compile, path, template} = await getEngineFixture({token: HoganEngine, cache: true});

    await renderFile();
    const content = await renderFile();

    expect(content).toEqual("<p>Tobi</p>");
    expect($compile()).toHaveBeenCalledTimes(1);
    expect($compile()).toHaveBeenCalledWith(template, {
      ...locals,
      partials: undefined,
      filename: path,
      cache: true
    });
  });

  // partials
  it("should support partials", async () => {
    const {renderFile} = await getEngineFixture({token: HoganEngine, templateName: "partials"});
    const locals = {
      partials: {
        partial: "user"
      }
    };
    const html = await renderFile(locals);

    expect(html).toEqual("<p>Tobi</p>");
  });
  it("should support absolute path partial", async () => {
    const {renderFile, rootDir, name} = await getEngineFixture({token: HoganEngine, templateName: "partials"});
    const locals = {partials: {partial: join(rootDir, "fixtures", name, "user")}};
    const html = await renderFile(locals);

    expect(html).toEqual("<p>Tobi</p>");
  });
  it("should support relative path partial", async () => {
    const {renderFile, name} = await getEngineFixture({token: HoganEngine, templateName: "partials"});

    const locals = {partials: {partial: `../${name}/user`}};
    const html = await renderFile(locals);
    expect(html).toEqual("<p>Tobi</p>");
  });
});
