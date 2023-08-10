import {Writer} from "./Writer";

describe("Writer", () => {
  it("should generate code for if/else condition", () => {
    const writer = new Writer();

    writer.if("condition").add("return true;").else().add("return false;");

    expect(writer.toString()).toMatchSnapshot();
  });
});
