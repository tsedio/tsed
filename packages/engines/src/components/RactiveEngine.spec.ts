import {getEngineFixture} from "../../test/getEngineFixture.js";
import {RactiveEngine} from "./RactiveEngine.js";

describe("RactiveEngine", () => {
  it("should render the given content (by string - no cache)", async () => {
    const {render, locals, $compile, template} = await getEngineFixture({token: RactiveEngine});
    await render();

    expect(await render()).toEqual("<p>Tobi</p>");
    expect($compile()).toHaveBeenCalledTimes(2);
  });
  it("should render the given content (by string - with cache)", async () => {
    const {render, $compile, template} = await getEngineFixture({token: RactiveEngine, cache: true});
    await render();

    expect(await render()).toEqual("<p>Tobi</p>");
    expect($compile()).toHaveBeenCalledTimes(2);
  });
  it("should render the given content (by file - no cache)", async () => {
    const {renderFile, $compileFile} = await getEngineFixture({token: RactiveEngine});
    await renderFile();
    const content = await renderFile();

    expect(content).toEqual("<p>Tobi</p>");
    expect($compileFile()).toHaveBeenCalledTimes(2);
  });
  it("should render the given content (by file - with cache)", async () => {
    const {renderFile, $compileFile} = await getEngineFixture({token: RactiveEngine, cache: true});

    await renderFile();
    const content = await renderFile();

    expect(content).toEqual("<p>Tobi</p>");
    expect($compileFile()).toHaveBeenCalledTimes(1);
  });
});
