import {RequestContext} from "./RequestContext";

describe("RequestContext", () => {
  it("should create a new Context", () => {
    // @ts-ignore
    const context = new RequestContext({id: "id"});

    context.id.should.eq("id");
    context.dateStart.should.be.instanceof(Date);
    context.container.should.be.instanceof(Map);
  });
});
