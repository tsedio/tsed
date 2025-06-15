import {InjectorService} from "@tsed/di";
import {Logger} from "@tsed/logger";
import {EndpointMetadata} from "@tsed/schema";
import {vi} from "vitest";

import {GCPContext} from "../domain/GCPContext.js";
import {type GCPBackgroundEvent, type GCPHttpEvent} from "../domain/GCPEvent.js";

export function createFakeHttpEvent(): GCPHttpEvent {
  return {
    req: {
      method: "GET",
      url: "/",
      path: "/",
      headers: {},
      query: {},
      params: {},
      body: {},
      secure: false,
      protocol: "https",
      hostname: "localhost"
    } as any,
    res: {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      get: vi.fn().mockReturnValue(undefined),
      append: vi.fn().mockReturnThis(),
      end: vi.fn().mockReturnThis(),
      location: vi.fn().mockReturnThis(),
      redirect: vi.fn().mockReturnThis()
    } as any
  };
}

export function createFakeBackgroundEvent(): GCPBackgroundEvent {
  return {
    data: {
      message: "test"
    },
    context: {
      eventId: "event-id",
      timestamp: new Date().toISOString(),
      eventType: "test-event",
      resource: {
        service: "test-service",
        name: "test-resource"
      }
    }
  };
}

export function createGCPContext({
  event = createFakeHttpEvent(),
  endpoint = new EndpointMetadata({}),
  logger = new Logger("test"),
  injector = new InjectorService()
} = {}): GCPContext {
  return new GCPContext({
    event,
    endpoint,
    id: "test-id",
    logger,
    injector
  });
}
