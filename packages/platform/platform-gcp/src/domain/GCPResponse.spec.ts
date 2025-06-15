import {describe, expect, it, vi} from "vitest";

import {createFakeBackgroundEvent, createFakeHttpEvent, createGCPContext} from "../utils/createGCPContext.js";
import {GCPResponse} from "./GCPResponse.js";

describe("GCPResponse", () => {
  describe("with HTTP event", () => {
    it("should create a response with HTTP event", () => {
      const context = createGCPContext({event: createFakeHttpEvent()});
      const response = context.response;

      expect(response).toBeInstanceOf(GCPResponse);
      expect(response.event).toBe(context.event);
    });

    it("should set status", () => {
      const httpEvent = createFakeHttpEvent();
      const context = createGCPContext({event: httpEvent});
      const response = context.response;

      response.status(201);

      expect(response.getStatus()).toBe(201);
      expect(response.statusCode).toBe(201);
      expect(httpEvent.res.status).toHaveBeenCalledWith(201);
    });

    it("should set headers", () => {
      const httpEvent = createFakeHttpEvent();
      const context = createGCPContext({event: httpEvent});
      const response = context.response;

      response.set("content-type", "application/json");
      response.set("x-request-id", "123");

      expect(response.get("content-type")).toBe("application/json");
      expect(response.get("x-request-id")).toBe("123");
      expect(response.getHeaders()).toEqual({
        "content-type": "application/json",
        "x-request-id": "123"
      });
      expect(httpEvent.res.set).toHaveBeenCalledWith("content-type", "application/json");
      expect(httpEvent.res.set).toHaveBeenCalledWith("x-request-id", "123");
    });

    it("should set multiple headers at once", () => {
      const httpEvent = createFakeHttpEvent();
      const context = createGCPContext({event: httpEvent});
      const response = context.response;

      response.setHeaders({
        "content-type": "application/json",
        "x-request-id": "123"
      });

      expect(response.getHeaders()).toEqual({
        "content-type": "application/json",
        "x-request-id": "123"
      });
      expect(httpEvent.res.set).toHaveBeenCalledWith("content-type", "application/json");
      expect(httpEvent.res.set).toHaveBeenCalledWith("x-request-id", "123");
    });

    it("should set content type", () => {
      const httpEvent = createFakeHttpEvent();
      const context = createGCPContext({event: httpEvent});
      const response = context.response;

      response.contentType("json");

      expect(response.getContentType()).toBe("application/json");
      expect(httpEvent.res.set).toHaveBeenCalledWith("Content-Type", "application/json");
    });

    it("should set content length", () => {
      const httpEvent = createFakeHttpEvent();
      const context = createGCPContext({event: httpEvent});
      const response = context.response;

      response.contentLength(100);

      expect(response.getContentLength()).toBe(100);
      expect(httpEvent.res.set).toHaveBeenCalledWith("Content-Length", 100);
    });

    it("should set body", () => {
      const httpEvent = createFakeHttpEvent();
      const context = createGCPContext({event: httpEvent});
      const response = context.response;

      response.body({name: "test"});

      expect(response.getBody()).toEqual({name: "test"});
      expect(httpEvent.res.send).toHaveBeenCalledWith({name: "test"});
    });

    it("should set location", () => {
      const httpEvent = createFakeHttpEvent();
      const context = createGCPContext({event: httpEvent});
      const response = context.response;

      response.location("/new-location");

      expect(response.get("Location")).toBe("/new-location");
      expect(httpEvent.res.location).toHaveBeenCalledWith("/new-location");
    });

    it("should redirect", () => {
      const httpEvent = createFakeHttpEvent();
      const context = createGCPContext({event: httpEvent});
      const response = context.response;

      response.redirect(302, "/new-location");

      expect(response.getStatus()).toBe(302);
      expect(response.get("Location")).toBe("/new-location");
      expect(httpEvent.res.redirect).toHaveBeenCalledWith(302, "/new-location");
    });

    it("should redirect with default status 302", () => {
      const httpEvent = createFakeHttpEvent();
      const context = createGCPContext({event: httpEvent});
      const response = context.response;

      response.redirect("/new-location");

      expect(response.getStatus()).toBe(302);
      expect(response.get("Location")).toBe("/new-location");
      expect(httpEvent.res.redirect).toHaveBeenCalledWith(302, "/new-location");
    });
  });

  describe("with Background event", () => {
    it("should create a response with Background event", () => {
      const context = createGCPContext({event: createFakeBackgroundEvent()});
      const response = context.response;

      expect(response).toBeInstanceOf(GCPResponse);
      expect(response.event).toBe(context.event);
    });

    it("should set status", () => {
      const context = createGCPContext({event: createFakeBackgroundEvent()});
      const response = context.response;

      response.status(201);

      expect(response.getStatus()).toBe(201);
      expect(response.statusCode).toBe(201);
    });

    it("should set headers", () => {
      const context = createGCPContext({event: createFakeBackgroundEvent()});
      const response = context.response;

      response.set("content-type", "application/json");
      response.set("x-request-id", "123");

      expect(response.get("content-type")).toBe("application/json");
      expect(response.get("x-request-id")).toBe("123");
      expect(response.getHeaders()).toEqual({
        "content-type": "application/json",
        "x-request-id": "123"
      });
    });

    it("should set body", () => {
      const context = createGCPContext({event: createFakeBackgroundEvent()});
      const response = context.response;

      response.body({name: "test"});

      expect(response.getBody()).toEqual({name: "test"});
    });
  });

  describe("isDone()", () => {
    it("should return false by default", () => {
      const context = createGCPContext();
      const response = context.response;

      expect(response.isDone()).toBe(false);
    });

    it("should return true after destroy", () => {
      const context = createGCPContext();
      const response = context.response;

      response.destroy();

      expect(response.isDone()).toBe(true);
    });
  });

  describe("locals", () => {
    it("should set and get locals", () => {
      const context = createGCPContext();
      const response = context.response;

      response.locals = {user: {id: 1}};

      expect(response.locals).toEqual({user: {id: 1}});
    });
  });
});
