import {expect} from "chai";
import {RequestContext} from "./RequestContext";

describe("RequestContext", () => {
  it("should create a new Context", () => {
    // @ts-ignore
    const context = new RequestContext({id: "id"});

    expect(context.id).to.eq("id");
    expect(context.dateStart).to.be.instanceof(Date);
    expect(context.container).to.be.instanceof(Map);
  });
});
