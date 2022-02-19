import {catchError} from "@tsed/core";
import {expect} from "chai";
import {
  MovedPermanently,
  MovedTemporarily,
  MultipleChoices,
  PermanentRedirect,
  SeeOther,
  TemporaryRedirect,
  UseProxy,
  NotModified
} from "@tsed/exceptions";

describe("Redirections", () => {
  describe("MovedPermanently", () => {
    it("should emit an exception", () => {
      const err = new MovedPermanently("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(301);
      expect(err.toString()).to.equal("MOVED_PERMANENTLY(301): message");
    });
  });

  describe("MovedTemporarily", () => {
    it("should emit an exception", () => {
      const err = new MovedTemporarily("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(302);
      expect(err.toString()).to.equal("MOVED_TEMPORARILY(302): message");
    });
  });

  describe("MultipleChoices", () => {
    it("should emit an exception", () => {
      const err = new MultipleChoices("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(300);
      expect(err.toString()).to.equal("MULTIPLE_CHOICES(300): message");
    });
  });

  describe("NotModified", () => {
    it("should emit an exception", () => {
      const err = new NotModified("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(304);
      expect(err.toString()).to.equal("NOT_MODIFIED(304): message");
    });
  });

  describe("PermanentRedirect", () => {
    it("should emit an exception", () => {
      const err = new PermanentRedirect("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(308);
      expect(err.toString()).to.equal("PERMANENT_REDIRECT(308): message");
    });
  });

  describe("SeeOther", () => {
    it("should emit an exception", () => {
      const err = new SeeOther("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(303);
      expect(err.toString()).to.equal("SEE_OTHER(303): message");
    });
  });

  describe("TemporaryRedirect", () => {
    it("should emit an exception", () => {
      const err = new TemporaryRedirect("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(307);
      expect(err.toString()).to.equal("TEMPORARY_REDIRECT(307): message");
    });
  });

  describe("UseProxy", () => {
    it("should emit an exception", () => {
      const err = new UseProxy("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).to.equal(305);
      expect(err.toString()).to.equal("USE_PROXY(305): message");
    });
  });
});
