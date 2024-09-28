import {catchError} from "@tsed/core";

import {
  BadGateway,
  BandwidthLimitExceeded,
  GatewayTimeout,
  InternalServerError,
  NetworkAuthenticationRequired,
  NotExtended,
  NotImplemented,
  ProxyError,
  ServiceUnavailable,
  VariantAlsoNegotiates
} from "../src/index.js";

describe("ServerErrors", () => {
  describe("BadGateway", () => {
    it("should emit an exception", () => {
      const err = new BadGateway("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(502);
      expect(err.toString()).toEqual("BAD_GATEWAY(502): message");
    });
  });

  describe("BandwidthLimitExceeded", () => {
    it("should emit an exception", () => {
      const err = new BandwidthLimitExceeded("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(509);
      expect(err.toString()).toEqual("BANDWIDTH_LIMIT_EXCEEDED(509): message");
    });
  });

  describe("GatewayTimeout", () => {
    it("should emit an exception", () => {
      const err = new GatewayTimeout("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(504);
      expect(err.toString()).toEqual("GATEWAY_TIMEOUT(504): message");
    });
  });

  describe("InternalServerError", () => {
    it("should emit an exception", () => {
      const err = new InternalServerError("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(500);
      expect(err.toString()).toEqual("INTERNAL_SERVER_ERROR(500): message");
    });
  });

  describe("NetworkAuthentificationRequired", () => {
    it("should emit an exception", () => {
      const err = new NetworkAuthenticationRequired("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(511);
      expect(err.toString()).toEqual("NETWORK_AUTHENTICATION_REQUIRED(511): message");
    });
  });

  describe("NotExtended", () => {
    it("should emit an exception", () => {
      const err = new NotExtended("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(510);
      expect(err.toString()).toEqual("NOT_EXTENDED(510): message");
    });
  });

  describe("NotImplemented", () => {
    it("should emit an exception", () => {
      const err = new NotImplemented("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(501);
      expect(err.toString()).toEqual("NOT_IMPLEMENTED(501): message");
    });
  });

  describe("ProxyError", () => {
    it("should emit an exception", () => {
      const err = new ProxyError("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(502);
      expect(err.toString()).toEqual("PROXY_ERROR(502): message");
    });
  });

  describe("ServiceUnavailable", () => {
    it("should emit an exception", () => {
      const err = new ServiceUnavailable("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(503);
      expect(err.toString()).toEqual("SERVICE_UNAVAILABLE(503): message");
    });
  });

  describe("VariantAlsoNegotiates", () => {
    it("should emit an exception", () => {
      const err = new VariantAlsoNegotiates("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(506);
      expect(err.toString()).toEqual("VARIANT_ALSO_NEGOTIATES(506): message");
    });
  });
});
