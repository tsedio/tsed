import {catchError} from "@tsed/core";
import {describe, expect, it} from "vitest";

import {
  BadMapping,
  BadRequest,
  Conflict,
  ExpectationFailed,
  Forbidden,
  Gone,
  ImATeapot,
  LengthRequired,
  MethodNotAllowed,
  MisdirectedRequest,
  NotAcceptable,
  NotFound,
  PaymentRequired,
  PreconditionFailed,
  PreconditionRequired,
  ProxyAuthentificationRequired,
  RequestEntityTooLarge,
  RequestHeaderFieldsTooLarge,
  RequestRangeUnsatisfiable,
  RequestTimeout,
  RequestURITooLong,
  TooManyRequests,
  Unauthorized,
  UnavailableForLegalReasons,
  UnprocessableEntity,
  UnsupportedMediaType,
  UpgradeRequired
} from "../src/index.js";

describe("ClientErrors", () => {
  describe("BadMapping", () => {
    it("should emit an exception", () => {
      const err = new BadMapping("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(421);
      expect(err.toString()).toEqual("BAD_MAPPING(421): message");
    });
  });

  describe("BadRequest", () => {
    it("should emit an exception", () => {
      const err = new BadRequest("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(400);
      expect(err.toString()).toEqual("BAD_REQUEST(400): message");
    });
  });

  describe("Conflict", () => {
    it("should emit an exception", () => {
      const err = new Conflict("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(409);
      expect(err.toString()).toEqual("CONFLICT(409): message");
    });
  });

  describe("ExpectationFailed", () => {
    it("should emit an exception", () => {
      const err = new ExpectationFailed("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(417);
      expect(err.toString()).toEqual("EXPECTATION_FAILED(417): message");
    });
  });

  describe("Forbidden", () => {
    it("should emit an exception", () => {
      const err = new Forbidden("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(403);
      expect(err.toString()).toEqual("FORBIDDEN(403): message");
    });
  });

  describe("Gone", () => {
    it("should emit an exception", () => {
      const err = new Gone("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(410);
      expect(err.toString()).toEqual("GONE(410): message");
    });
  });

  describe("ImATeapot", () => {
    it("should emit an exception", () => {
      const err = new ImATeapot("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(418);
      expect(err.toString()).toEqual("IM_A_TEAPOT(418): message");
    });
  });

  describe("LengthRequired", () => {
    it("should emit an exception", () => {
      const err = new LengthRequired("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(411);
      expect(err.toString()).toEqual("LENGTH_REQUIRED(411): message");
    });
  });

  describe("MethodNotAllowed", () => {
    it("should emit an exception", () => {
      const err = new MethodNotAllowed("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(405);
      expect(err.toString()).toEqual("METHOD_NOT_ALLOWED(405): message");
    });
  });

  describe("MisdirectedRequest", () => {
    it("should emit an exception", () => {
      const err = new MisdirectedRequest("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(421);
      expect(err.toString()).toEqual("MISDIRECTED_REQUEST(421): message");
    });
  });

  describe("NotAcceptable", () => {
    it("should emit an exception", () => {
      const err = new NotAcceptable("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(406);
      expect(err.toString()).toEqual("NOT_ACCEPTABLE(406): You must accept content-type message");
    });
  });

  describe("NotFound", () => {
    it("should emit an exception", () => {
      const err = new NotFound("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(404);
      expect(err.toString()).toEqual("NOT_FOUND(404): message");
    });
  });

  describe("PaymentRequired", () => {
    it("should emit an exception", () => {
      const err = new PaymentRequired("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(402);
      expect(err.toString()).toEqual("PAYMENT_REQUIRED(402): message");
    });
  });

  describe("PreconditionFailed", () => {
    it("should emit an exception", () => {
      const err = new PreconditionFailed("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(412);
      expect(err.toString()).toEqual("PRECONDITION_FAILED(412): message");
    });
  });

  describe("PreconditionRequired", () => {
    it("should emit an exception", () => {
      const err = new PreconditionRequired("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(428);
      expect(err.toString()).toEqual("PRECONDITION_REQUIRED(428): message");
    });
  });

  describe("ProxyAuthentificationRequired", () => {
    it("should emit an exception", () => {
      const err = new ProxyAuthentificationRequired("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(407);
      expect(err.toString()).toEqual("PROXY_AUTHENTICATION_REQUIRED(407): message");
    });
  });

  describe("RequestedRangeUnsatisfiable", () => {
    it("should emit an exception", () => {
      const err = new RequestRangeUnsatisfiable("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(416);
      expect(err.toString()).toEqual("RANGE_NOT_SATISFIABLE(416): message");
    });
  });

  describe("RequestEntityTooLarge", () => {
    it("should emit an exception", () => {
      const err = new RequestEntityTooLarge("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(413);
      expect(err.toString()).toEqual("PAYLOAD_TOO_LARGE(413): message");
    });
  });

  describe("RequestHeaderFieldsTooLarge", () => {
    it("should emit an exception", () => {
      const err = new RequestHeaderFieldsTooLarge("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(431);
      expect(err.toString()).toEqual("REQUEST_HEADER_FIELDS_TOO_LARGE(431): message");
    });
  });

  describe("RequestTimeout", () => {
    it("should emit an exception", () => {
      const err = new RequestTimeout("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(408);
      expect(err.toString()).toEqual("REQUEST_TIMEOUT(408): message");
    });
  });

  describe("RequestURITooLong", () => {
    it("should emit an exception", () => {
      const err = new RequestURITooLong("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(414);
      expect(err.toString()).toEqual("URI_TOO_LONG(414): message");
    });
  });

  describe("TooManyRequests", () => {
    it("should emit an exception", () => {
      const err = new TooManyRequests("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(429);
      expect(err.toString()).toEqual("TOO_MANY_REQUESTS(429): message");
    });
  });

  describe("Unauthorized", () => {
    it("should emit an exception", () => {
      const err = new Unauthorized("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(401);
      expect(err.toString()).toEqual("UNAUTHORIZED(401): message");
    });
  });

  describe("UnavailableForLegalReasons", () => {
    it("should emit an exception", () => {
      const err = new UnavailableForLegalReasons("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(451);
      expect(err.toString()).toEqual("UNAVAILABLE_FOR_LEGAL_REASONS(451): message");
    });
  });

  describe("UnusupportedMediaType", () => {
    it("should emit an exception", () => {
      const err = new UnsupportedMediaType("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(415);
      expect(err.toString()).toEqual("UNSUPPORTED_MEDIA_TYPE(415): message");
    });
  });

  describe("UpgradeRequired", () => {
    it("should emit an exception", () => {
      const err = new UpgradeRequired("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(426);
      expect(err.toString()).toEqual("UPGRADE_REQUIRED(426): message");
    });
  });

  describe("UnprocessableEntity", () => {
    it("should emit an exception", () => {
      const err = new UnprocessableEntity("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(422);
      expect(err.toString()).toEqual("UNPROCESSABLE_ENTITY(422): message");
    });
  });
});
