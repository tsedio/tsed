import {expect} from "chai";
import {getEngineFixture} from "../../test/getEngineFixture.js";
import {TwigEngine} from "./TwigEngine.js";

describe("TwigEngine", () => {
  it("should render the given content (by string - no cache)", async () => {
    const {render, $compile, template} = await getEngineFixture({token: TwigEngine});
    await render();

    expect(await render()).to.eq("<p>Tobi</p>");
    expect($compile()).to.have.been.callCount(2);
    expect($compile()).to.have.been.calledWithExactly(template, {
      allowInlineIncludes: undefined,
      cache: false,
      data: "<p>{{ user.name }}</p>",
      namespaces: undefined,
      path: undefined,
      user: {name: "Tobi"}
    });
  });
  it("should render the given content (by string - with cache)", async () => {
    const {render, $compile} = await getEngineFixture({token: TwigEngine, cache: true});
    await render();

    expect(await render()).to.eq("<p>Tobi</p>");
    expect($compile()).to.have.been.callCount(2);
  });
  it("should render the given content (by file - no cache)", async () => {
    const {renderFile, $compileFile, path} = await getEngineFixture({token: TwigEngine});
    await renderFile();
    const content = await renderFile();

    expect(content).to.eq("<p>Tobi</p>");
    expect($compileFile()).to.have.been.callCount(2);
  });
  it("should render the given content (by file - with cache)", async () => {
    const {renderFile, $compileFile} = await getEngineFixture({token: TwigEngine, cache: true});

    await renderFile();
    const content = await renderFile();

    expect(content).to.eq("<p>Tobi</p>");
    expect($compileFile()).to.have.been.callCount(1);
  });
});
