import {expect} from "chai";
import {dirname} from "node:path";
import {getEngineFixture} from "../../test/getEngineFixture";
import {EtaEngine} from "./EtaEngine";

describe("EtaEngine", () => {
  it("should render the given content", async () => {
    const {render, locals, $compile, template} = await getEngineFixture({
      token: EtaEngine
    });

    await render();

    expect(await render()).to.eq("<p>Tobi</p>\n");
    expect($compile()).to.have.been.callCount(2);
    expect($compile()).to.have.been.calledWithExactly(template, {...locals, cache: false});
  });

  it("should render the given content (by string - no cache)", async () => {
    const {render, locals, $compile, template} = await getEngineFixture({token: EtaEngine});
    await render();

    expect(await render()).to.eq("<p>Tobi</p>\n");
    expect($compile()).to.have.been.callCount(2);
    expect($compile()).to.have.been.calledWithExactly(template, {...locals, cache: false});
  });
  it("should render the given content (by string - with cache)", async () => {
    const {render, locals, $compile, template} = await getEngineFixture({token: EtaEngine, cache: true});
    await render();

    expect(await render()).to.eq("<p>Tobi</p>\n");
    expect($compile()).to.have.been.callCount(2);
    expect($compile()).to.have.been.calledWithExactly(template, {...locals, cache: true});
  });
  it("should render the given content (by file - no cache)", async () => {
    const {renderFile, locals, $compileFile, path, template} = await getEngineFixture({
      token: EtaEngine,
      useTemplateName: true
    });

    await renderFile({
      views: dirname(path)
    });

    const content = await renderFile({
      views: dirname(path)
    });

    expect(content).to.eq("<p>Tobi</p>\n");
    expect($compileFile()).to.have.been.callCount(2);
    expect($compileFile()).to.have.been.calledWithExactly("user", {
      ...locals,
      partials: undefined,
      filename: "user",
      cache: false,
      views: dirname(path)
    });
  });
  it("should render the given content (by file - with cache - with entire file path)", async () => {
    const {renderFile, locals, $compileFile, path, template} = await getEngineFixture({
      token: EtaEngine,
      cache: true
    });

    await renderFile({
      root: dirname(path)
    });
    const content = await renderFile();

    expect(content).to.eq("<p>Tobi</p>\n");
    expect($compileFile()).to.have.been.callCount(1);
    expect($compileFile()).to.have.been.calledWithExactly(path, {
      cache: true,
      user: {name: "Tobi"},
      root: dirname(path),
      filename: path,
      partials: undefined
    });
  });
});
