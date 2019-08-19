import {Context} from "../../../src/mvc";

describe("RequestLogger", () => {
  it("should create a new Context", () => {
    const context = new Context({id: "id"});

    context.id.should.eq("id");
    context.dateStart.should.be.instanceof(Date);
    context.container.should.be.instanceof(Map);
  });
});
