import {expect} from "chai";
import {getEngineFixture} from "../../test/getEngineFixture";
import {VueEngine} from "./VueEngine";

describe("VueEngine", () => {
  beforeEach(() => {
    process.env.VUE_DEV = String(true);
  });
  it("should render the given content (by string - no cache)", async () => {
    const {render, $compile} = await getEngineFixture({token: VueEngine});
    await render();

    expect(await render()).to.eq('<p data-server-rendered="true">Tobi</p>');
    expect($compile()).to.have.been.callCount(2);
  });
  it("should render the given content (by string - with cache)", async () => {
    const {render, $compile} = await getEngineFixture({token: VueEngine, cache: true});
    await render();

    expect(await render()).to.eq('<p data-server-rendered="true">Tobi</p>');
    expect($compile()).to.have.been.callCount(1);
  });
  it("should render the given content (by file - no cache)", async () => {
    const {renderFile, $compileFile} = await getEngineFixture({token: VueEngine});
    await renderFile();
    const content = await renderFile();

    expect(content).to.contains('<p data-server-rendered="true">Tobi</p></div><script>');
    expect($compileFile()).to.have.been.callCount(2);
  });
  it("should render the given content (by file - with cache)", async () => {
    const {renderFile, $compileFile} = await getEngineFixture({token: VueEngine, cache: true});

    await renderFile();
    const content = await renderFile();

    expect(content).to.contains('<p data-server-rendered="true">Tobi</p></div><script>');
    expect($compileFile()).to.have.been.callCount(1);
  });
});
