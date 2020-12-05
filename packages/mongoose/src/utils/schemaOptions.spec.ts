import {expect} from "chai";
import * as Sinon from "sinon";
import {applySchemaOptions, schemaOptions} from "../../src/utils/schemaOptions";

describe("schemaOptions", () => {
  describe("schemaOptions()", () => {
    class Test {}

    before(() => {});

    it("should return schema options (1)", () => {
      expect(schemaOptions(Test)).to.deep.eq({});
    });

    it("should return schema options (2)", () => {
      expect(schemaOptions(Test, {options: "options"} as any)).to.deep.eq({options: "options"});
    });

    it("should return schema options (3)", () => {
      expect(schemaOptions(Test, {options2: "options2"} as any)).to.deep.eq({
        options: "options",
        options2: "options2"
      });
    });
  });
  describe("applySchemaOptions()", () => {
    const schema: any = {
      pre: Sinon.stub(),
      post: Sinon.stub(),
      plugin: Sinon.stub(),
      index: Sinon.stub()
    };

    before(() => {
      applySchemaOptions(schema, {
        pre: [
          {
            method: "method",
            fn: (doc: any, pre: any) => {},
            options: {query: true}
          }
        ],
        post: [
          {
            method: "method",
            fn: "fn"
          }
        ],
        plugins: [{plugin: "plugin", options: "options"}],
        indexes: [{fields: "fields", options: "options"}]
      } as any);
    });

    it("should call schema.pre", () => {
      expect(schema.pre).to.have.been.calledWithExactly("method", {query: true}, Sinon.match.func);
    });

    it("should call schema.post", () => {
      expect(schema.post).to.have.been.calledWithExactly("method", "fn");
    });

    it("should call schema.plugin", () => {
      expect(schema.plugin).to.have.been.calledWithExactly("plugin", "options");
    });

    it("should call schema.index", () => {
      expect(schema.index).to.have.been.calledWithExactly("fields", "options");
    });
  });
});
