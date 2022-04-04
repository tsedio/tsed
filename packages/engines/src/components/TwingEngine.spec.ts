import {expect} from "chai";
import {getEngineFixture} from "../../test/getEngineFixture";
import {TwingEngine} from "./TwingEngine";

describe("TwingEngine", () => {
  it("should render the given content (by string - no cache)", async () => {
    const {render, $compile} = await getEngineFixture({token: TwingEngine});
    await render();

    expect(await render()).to.eq("<p>Tobi</p>");
    expect($compile()).to.have.been.callCount(2);
  });
  it("should render the given content (by string - with cache)", async () => {
    const {render, $compile} = await getEngineFixture({token: TwingEngine, cache: true});
    await render();

    expect(await render()).to.eq("<p>Tobi</p>");
    expect($compile()).to.have.been.callCount(2);
  });
  it("should render the given content (by file - no cache)", async () => {
    const {renderFile, $compileFile} = await getEngineFixture({token: TwingEngine});
    await renderFile();
    const content = await renderFile();

    expect(content).to.eq("<p>Tobi</p>");
    expect($compileFile()).to.have.been.callCount(2);
  });
  it("should render the given content (by file - with cache)", async () => {
    const {renderFile, $compileFile, path} = await getEngineFixture({token: TwingEngine, cache: true});

    await renderFile();
    const content = await renderFile();

    expect(content).to.eq("<p>Tobi</p>");
    expect($compileFile()).to.have.been.callCount(1);
  });
});
