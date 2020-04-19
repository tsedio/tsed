import {assert, expect} from "chai";
import {
  BadGateway,
  BandwidthLimitExceeded,
  GatewayTimeout,
  InternalServerError,
  NetworkAuthenticationRequired,
  NotExtended,
  NotImplemented,
  ProxyError,
  ServiceUnvailable,
  VariantAlsoNegotiates
} from "@tsed/exceptions";

describe("ServerErrors", () => {
  describe("BadGateway", () => {
    it("should emit an exception", () => {
      const err = new BadGateway("message");

      assert.throw(() => {
        throw err;
      }, "message");

      expect(err.status).to.equal(502);
      expect(err.toString()).to.equal("BAD_GATEWAY(502): message");
    });
  });

  describe("BandwidthLimitExceeded", () => {
    it("should emit an exception", () => {
      const err = new BandwidthLimitExceeded("message");

      assert.throw(() => {
        throw err;
      }, "message");

      expect(err.status).to.equal(509);
      expect(err.toString()).to.equal("BANDWIDTH_LIMIT_EXCEEDED(509): message");
    });
  });

  describe("GatewayTimeout", () => {
    it("should emit an exception", () => {
      const err = new GatewayTimeout("message");

      assert.throw(() => {
        throw err;
      }, "message");

      expect(err.status).to.equal(504);
      expect(err.toString()).to.equal("GATEWAY_TIMEOUT(504): message");
    });
  });

  describe("InternalServerError", () => {
    it("should emit an exception", () => {
      const err = new InternalServerError("message");

      assert.throw(() => {
        throw err;
      }, "message");

      expect(err.status).to.equal(500);
      expect(err.toString()).to.equal("INTERNAL_SERVER_ERROR(500): message");
    });
  });

  describe("NetworkAuthentificationRequired", () => {
    it("should emit an exception", () => {
      const err = new NetworkAuthenticationRequired("message");

      assert.throw(() => {
        throw err;
      }, "message");

      expect(err.status).to.equal(511);
      expect(err.toString()).to.equal("NETWORK_AUTHENTICATION_REQUIRED(511): message");
    });
  });

  describe("NotExtended", () => {
    it("should emit an exception", () => {
      const err = new NotExtended("message");

      assert.throw(() => {
        throw err;
      }, "message");

      expect(err.status).to.equal(510);
      expect(err.toString()).to.equal("NOT_EXTENDED(510): message");
    });
  });

  describe("NotImplemented", () => {
    it("should emit an exception", () => {
      const err = new NotImplemented("message");

      assert.throw(() => {
        throw err;
      }, "message");

      expect(err.status).to.equal(501);
      expect(err.toString()).to.equal("NOT_IMPLEMENTED(501): message");
    });
  });

  describe("ProxyError", () => {
    it("should emit an exception", () => {
      const err = new ProxyError("message");

      assert.throw(() => {
        throw err;
      }, "message");

      expect(err.status).to.equal(502);
      expect(err.toString()).to.equal("PROXY_ERROR(502): message");
    });
  });

  describe("ServiceUnvailable", () => {
    it("should emit an exception", () => {
      const err = new ServiceUnvailable("message");

      assert.throw(() => {
        throw err;
      }, "message");

      expect(err.status).to.equal(503);
      expect(err.toString()).to.equal("SERVICE_UNVAILABLE(503): message");
    });
  });

  describe("VariantAlsoNegotiates", () => {
    it("should emit an exception", () => {
      const err = new VariantAlsoNegotiates("message");

      assert.throw(() => {
        throw err;
      }, "message");

      expect(err.status).to.equal(506);
      expect(err.toString()).to.equal("VARIANT_ALSO_NEGOTIATES(506): message");
    });
  });
});
