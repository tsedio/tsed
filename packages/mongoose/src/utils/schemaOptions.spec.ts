import {expect} from "chai";
import * as Sinon from "sinon";
import {applySchemaOptions, buildPreHook, schemaOptions} from "../../src/utils/schemaOptions";

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
  describe("buildPreHook()", () => {
    describe("when the function has 1 parameter", () => {
      before(() => {});

      it("should call the fn with the right parameters", () => {
        // GIVEN
        const ctx = {op: "op"};
        const stub = Sinon.stub();
        const hook = buildPreHook((t: any, next: any) => {
          stub(t, next);
        });

        hook.call(ctx, "next");
        stub.should.have.been.calledWithExactly(ctx, "next");
      });
    });

    describe("when the function has 2 parameters", () => {
      it("should call the fn with the right parameters", () => {
        const ctx = {op: "op"};
        const stub = Sinon.stub();
        const hook = buildPreHook((t: any, next: any, done: any) => {
          stub(t, next, done);
        });

        hook.call(ctx, "next", "done");
        stub.should.have.been.calledWithExactly(ctx, "next", "done");
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
            parallel: true,
            fn: (doc: any, pre: any) => {},
            errorCb: "errorCb"
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
      schema.pre.should.have.been.calledWithExactly("method", true, Sinon.match.func, "errorCb");
    });

    it("should call schema.post", () => {
      schema.post.should.have.been.calledWithExactly("method", "fn");
    });

    it("should call schema.plugin", () => {
      schema.plugin.should.have.been.calledWithExactly("plugin", "options");
    });

    it("should call schema.index", () => {
      schema.index.should.have.been.calledWithExactly("fields", "options");
    });
  });
});
