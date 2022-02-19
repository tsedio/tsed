import {catchError} from "@tsed/core";
import {
  BadMapping,
  BadRequest,
  Conflict,
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
  RequestRangeUnsatisfiable,
  RequestEntityTooLarge,
  RequestHeaderFieldsTooLarge,
  RequestTimeout,
  RequestURITooLong,
  TooManyRequests,
  Unauthorized,
  UnavailableForLegalReasons,
  UnprocessableEntity,
  UnsupportedMediaType,
  UpgradeRequired,
  ExpectationFailed
} from "@tsed/exceptions";
import {expect} from "chai";

describe("ClientErrors", () => {
  describe("BadMapping", () => {
    it("should emit an exception", () => {
      const err = new BadMapping("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(421);
      expect(err.toString()).to.equal("BAD_MAPPING(421): message");
    });
  });

  describe("BadRequest", () => {
    it("should emit an exception", () => {
      const err = new BadRequest("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(400);
      expect(err.toString()).to.equal("BAD_REQUEST(400): message");
    });
  });

  describe("Conflict", () => {
    it("should emit an exception", () => {
      const err = new Conflict("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(409);
      expect(err.toString()).to.equal("CONFLICT(409): message");
    });
  });

  describe("ExpectationFailed", () => {
    it("should emit an exception", () => {
      const err = new ExpectationFailed("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(417);
      expect(err.toString()).to.equal("EXPECTATION_FAILED(417): message");
    });
  });

  describe("Forbidden", () => {
    it("should emit an exception", () => {
      const err = new Forbidden("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(403);
      expect(err.toString()).to.equal("FORBIDDEN(403): message");
    });
  });

  describe("Gone", () => {
    it("should emit an exception", () => {
      const err = new Gone("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(410);
      expect(err.toString()).to.equal("GONE(410): message");
    });
  });

  describe("ImATeapot", () => {
    it("should emit an exception", () => {
      const err = new ImATeapot("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(418);
      expect(err.toString()).to.equal("IM_A_TEAPOT(418): message");
    });
  });

  describe("LengthRequired", () => {
    it("should emit an exception", () => {
      const err = new LengthRequired("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(411);
      expect(err.toString()).to.equal("LENGTH_REQUIRED(411): message");
    });
  });

  describe("MethodNotAllowed", () => {
    it("should emit an exception", () => {
      const err = new MethodNotAllowed("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(405);
      expect(err.toString()).to.equal("METHOD_NOT_ALLOWED(405): message");
    });
  });

  describe("MisdirectedRequest", () => {
    it("should emit an exception", () => {
      const err = new MisdirectedRequest("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(421);
      expect(err.toString()).to.equal("MISDIRECTED_REQUEST(421): message");
    });
  });

  describe("NotAcceptable", () => {
    it("should emit an exception", () => {
      const err = new NotAcceptable("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(406);
      expect(err.toString()).to.equal("NOT_ACCEPTABLE(406): You must accept content-type message");
    });
  });

  describe("LengthRequired", () => {
    it("should emit an exception", () => {
      const err = new NotFound("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(404);
      expect(err.toString()).to.equal("NOT_FOUND(404): message");
    });
  });

  describe("PaymentRequired", () => {
    it("should emit an exception", () => {
      const err = new PaymentRequired("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(402);
      expect(err.toString()).to.equal("PAYMENT_REQUIRED(402): message");
    });
  });

  describe("PreconditionFailed", () => {
    it("should emit an exception", () => {
      const err = new PreconditionFailed("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(412);
      expect(err.toString()).to.equal("PRECONDITION_FAILED(412): message");
    });
  });

  describe("PreconditionRequired", () => {
    it("should emit an exception", () => {
      const err = new PreconditionRequired("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(428);
      expect(err.toString()).to.equal("PRECONDITION_REQUIRED(428): message");
    });
  });

  describe("ProxyAuthentificationRequired", () => {
    it("should emit an exception", () => {
      const err = new ProxyAuthentificationRequired("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(407);
      expect(err.toString()).to.equal("PROXY_AUTHENTICATION_REQUIRED(407): message");
    });
  });

  describe("RequestedRangeUnsatisfiable", () => {
    it("should emit an exception", () => {
      const err = new RequestRangeUnsatisfiable("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(416);
      expect(err.toString()).to.equal("RANGE_NOT_SATISFIABLE(416): message");
    });
  });

  describe("RequestEntityTooLarge", () => {
    it("should emit an exception", () => {
      const err = new RequestEntityTooLarge("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(413);
      expect(err.toString()).to.equal("PAYLOAD_TOO_LARGE(413): message");
    });
  });

  describe("RequestHeaderFieldsTooLarge", () => {
    it("should emit an exception", () => {
      const err = new RequestHeaderFieldsTooLarge("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(431);
      expect(err.toString()).to.equal("REQUEST_HEADER_FIELDS_TOO_LARGE(431): message");
    });
  });

  describe("RequestTimeout", () => {
    it("should emit an exception", () => {
      const err = new RequestTimeout("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(408);
      expect(err.toString()).to.equal("REQUEST_TIMEOUT(408): message");
    });
  });

  describe("RequestURITooLong", () => {
    it("should emit an exception", () => {
      const err = new RequestURITooLong("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(414);
      expect(err.toString()).to.equal("URI_TOO_LONG(414): message");
    });
  });

  describe("TooManyRequests", () => {
    it("should emit an exception", () => {
      const err = new TooManyRequests("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(429);
      expect(err.toString()).to.equal("TOO_MANY_REQUESTS(429): message");
    });
  });

  describe("Unauthorized", () => {
    it("should emit an exception", () => {
      const err = new Unauthorized("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(401);
      expect(err.toString()).to.equal("UNAUTHORIZED(401): message");
    });
  });

  describe("UnavailableForLegalReasons", () => {
    it("should emit an exception", () => {
      const err = new UnavailableForLegalReasons("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(451);
      expect(err.toString()).to.equal("UNAVAILABLE_FOR_LEGAL_REASONS(451): message");
    });
  });

  describe("UnusupportedMediaType", () => {
    it("should emit an exception", () => {
      const err = new UnsupportedMediaType("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(415);
      expect(err.toString()).to.equal("UNSUPPORTED_MEDIA_TYPE(415): message");
    });
  });

  describe("UpgradeRequired", () => {
    it("should emit an exception", () => {
      const err = new UpgradeRequired("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(426);
      expect(err.toString()).to.equal("UPGRADE_REQUIRED(426): message");
    });
  });

  describe("UnprocessableEntity", () => {
    it("should emit an exception", () => {
      const err = new UnprocessableEntity("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(422);
      expect(err.toString()).to.equal("UNPROCESSABLE_ENTITY(422): message");
    });
  });
});
