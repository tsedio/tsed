import {catchError} from "@tsed/core";

import {
  MovedPermanently,
  MovedTemporarily,
  MultipleChoices,
  NotModified,
  PermanentRedirect,
  SeeOther,
  TemporaryRedirect,
  UseProxy
} from "../src/index.js";

describe("Redirections", () => {
  describe("MovedPermanently", () => {
    it("should emit an exception", () => {
      const err = new MovedPermanently("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(301);
      expect(err.toString()).toEqual("MOVED_PERMANENTLY(301): message");
    });
  });

  describe("MovedTemporarily", () => {
    it("should emit an exception", () => {
      const err = new MovedTemporarily("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(302);
      expect(err.toString()).toEqual("MOVED_TEMPORARILY(302): message");
    });
  });

  describe("MultipleChoices", () => {
    it("should emit an exception", () => {
      const err = new MultipleChoices("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(300);
      expect(err.toString()).toEqual("MULTIPLE_CHOICES(300): message");
    });
  });

  describe("NotModified", () => {
    it("should emit an exception", () => {
      const err = new NotModified("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(304);
      expect(err.toString()).toEqual("NOT_MODIFIED(304): message");
    });
  });

  describe("PermanentRedirect", () => {
    it("should emit an exception", () => {
      const err = new PermanentRedirect("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(308);
      expect(err.toString()).toEqual("PERMANENT_REDIRECT(308): message");
    });
  });

  describe("SeeOther", () => {
    it("should emit an exception", () => {
      const err = new SeeOther("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(303);
      expect(err.toString()).toEqual("SEE_OTHER(303): message");
    });
  });

  describe("TemporaryRedirect", () => {
    it("should emit an exception", () => {
      const err = new TemporaryRedirect("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(307);
      expect(err.toString()).toEqual("TEMPORARY_REDIRECT(307): message");
    });
  });

  describe("UseProxy", () => {
    it("should emit an exception", () => {
      const err = new UseProxy("message");

      catchError(() => {
        throw err;
      });

      expect(err.status).toEqual(305);
      expect(err.toString()).toEqual("USE_PROXY(305): message");
    });
  });
});
