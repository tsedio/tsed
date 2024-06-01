import {getEngineFixture} from "../../test/getEngineFixture.js";
import {TwingEngine} from "./TwingEngine.js";

describe("TwingEngine", () => {
  it("should render the given content (by string - no cache)", async () => {
    const {render, $compile} = await getEngineFixture({token: TwingEngine});
    await render();

    expect(await render()).toEqual("<p>Tobi</p>");
    expect($compile()).toHaveBeenCalledTimes(2);
  });
  it("should render the given content (by string - with cache)", async () => {
    const {render, $compile} = await getEngineFixture({token: TwingEngine, cache: true});
    await render();

    expect(await render()).toEqual("<p>Tobi</p>");
    expect($compile()).toHaveBeenCalledTimes(2);
  });
  it("should render the given content (by file - no cache)", async () => {
    const {renderFile, $compileFile} = await getEngineFixture({token: TwingEngine});
    await renderFile();
    const content = await renderFile();

    expect(content).toEqual("<p>Tobi</p>");
    expect($compileFile()).toHaveBeenCalledTimes(2);
  });
  it("should render the given content (by file - with cache)", async () => {
    const {renderFile, $compileFile, path} = await getEngineFixture({token: TwingEngine, cache: true});

    await renderFile();
    const content = await renderFile();

    expect(content).toEqual("<p>Tobi</p>");
    expect($compileFile()).toHaveBeenCalledTimes(1);
  });
});
