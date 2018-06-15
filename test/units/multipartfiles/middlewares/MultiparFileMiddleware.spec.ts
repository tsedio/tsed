import {MultipartFileMiddleware} from "../../../../src/multipartfiles/middlewares/MultipartFileMiddleware";
import {Sinon} from "../../../tools";

describe("MultipartFileMiddleware", () => {
  describe("legacy", () => {
    before(() => {
      this.settings = {
        uploadDir: "/",
        get: Sinon.stub()
          .withArgs("multer")
          .returns({options: "options"})
      };
      this.middleware = new MultipartFileMiddleware(this.settings);
      this.expressMiddleware = Sinon.stub();
      this.middleware.multer = Sinon.stub().returns({
        any: Sinon.stub().returns(this.expressMiddleware)
      });

      this.nextSpy = Sinon.stub();

      this.middleware.use(
        {
          store: {
            get() {
              return {
                options: {options: "options"},
                any: true
              };
            }
          }
        },
        {request: "request"},
        {response: "response"},
        this.nextSpy
      );
    });

    it("should call multer with some options", () => {
      this.middleware.multer.should.be.calledWithExactly({dest: "/", options: "options"});
    });

    it("should create middleware and call it", () => {
      this.expressMiddleware.should.be.calledWithExactly({request: "request"}, {response: "response"}, this.nextSpy);
    });
  });

  describe("new feature", () => {
    before(() => {
      this.settings = {
        uploadDir: "/",
        get: Sinon.stub()
          .withArgs("multer")
          .returns({options: "options"})
      };
      this.middleware = new MultipartFileMiddleware(this.settings);
      this.expressMiddleware = Sinon.stub();
      this.multerApiStub = {
        fields: Sinon.stub().returns(this.expressMiddleware)
      };

      this.middleware.multer = Sinon.stub().returns(this.multerApiStub);

      this.nextSpy = Sinon.stub();

      this.middleware.use(
        {
          store: {
            get() {
              return {
                options: {options: "options"},
                fields: [{name: "test"}, {name: "test1", maxCount: 4}]
              };
            }
          }
        },
        {request: "request"},
        {response: "response"},
        this.nextSpy
      );
    });

    it("should call multer with some options", () => {
      this.middleware.multer.should.have.been.calledWithExactly({dest: "/", options: "options"});
    });

    it("should call multer.field()", () => {
      this.multerApiStub.fields.should.have.been.calledWithExactly([
        {
          maxCount: undefined,
          name: "test"
        },
        {
          maxCount: 4,
          name: "test1"
        }
      ]);
    });
    it("should create middleware and call it", () => {
      this.expressMiddleware.should.have.been.calledWithExactly({request: "request"}, {response: "response"}, this.nextSpy);
    });
  });
});
