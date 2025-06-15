import {Controller, Injectable} from "@tsed/di";
import {BodyParams, Context} from "@tsed/platform-params";
import {Returns} from "@tsed/schema";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

import {PlatformGCP} from "../src/builder/PlatformGCP.js";
import {GCPBackgroundEvent} from "../src/domain/GCPEvent.js";
import {GCPFunction} from "../src/exports.js";
import {createFakeBackgroundEvent} from "../src/utils/createGCPContext.js";

@Injectable()
class BackgroundService {
  processMessage(message: any) {
    return {
      processed: true,
      message,
      timestamp: new Date().toISOString()
    };
  }
}

@Controller("/")
class BackgroundController {
  constructor(private service: BackgroundService) {}

  @GCPFunction()
  @Returns(200, Object)
  processEvent(@BodyParams() data: any, @Context() context?: any) {
    return this.service.processMessage(data);
  }

  @GCPFunction()
  @Returns(200, Object)
  handlePubSub(@BodyParams() data: any) {
    // In a real scenario, PubSub messages would have a specific format
    const message = data.message?.data ? JSON.parse(Buffer.from(data.message.data, "base64").toString()) : data;

    return {
      success: true,
      message,
      source: "pubsub"
    };
  }

  @GCPFunction()
  @Returns(200, Object)
  handleStorage(@BodyParams() data: any) {
    // In a real scenario, Storage events would have a specific format
    return {
      success: true,
      bucket: data.bucket,
      file: data.name,
      source: "storage"
    };
  }
}

describe("Background Integration", () => {
  let platform: PlatformGCP;

  beforeEach(() => {
    platform = PlatformGCP.bootstrap({
      gcpFunctions: [BackgroundController]
    });
  });

  afterEach(async () => {
    await platform.stop();
  });

  describe("processEvent", () => {
    it("should process a generic event", async () => {
      // Create a handler for the processEvent method
      const handler = PlatformGCP.callback(BackgroundController, "processEvent");

      // Create a background event
      const bgEvent = createFakeBackgroundEvent();
      bgEvent.data = {
        type: "test",
        payload: {
          id: "123",
          action: "create"
        }
      };

      // Call the handler
      const result = await handler(bgEvent);

      // Verify the response
      expect(result).toEqual(
        expect.objectContaining({
          processed: true,
          message: {
            type: "test",
            payload: {
              id: "123",
              action: "create"
            }
          },
          timestamp: expect.any(String)
        })
      );
    });
  });

  describe("handlePubSub", () => {
    it("should handle a PubSub event", async () => {
      // Create a handler for the handlePubSub method
      const handler = PlatformGCP.callback(BackgroundController, "handlePubSub");

      // Create a background event with PubSub format
      const bgEvent = createFakeBackgroundEvent();
      const messageData = {
        id: "123",
        action: "create"
      };
      bgEvent.data = {
        message: {
          data: Buffer.from(JSON.stringify(messageData)).toString("base64"),
          attributes: {
            key: "value"
          },
          messageId: "message-id",
          publishTime: new Date().toISOString()
        },
        subscription: "projects/my-project/subscriptions/my-subscription"
      };

      // Call the handler
      const result = await handler(bgEvent);

      // Verify the response
      expect(result).toEqual({
        success: true,
        message: messageData,
        source: "pubsub"
      });
    });

    it("should handle a PubSub event with raw data", async () => {
      // Create a handler for the handlePubSub method
      const handler = PlatformGCP.callback(BackgroundController, "handlePubSub");

      // Create a background event with raw data
      const bgEvent = createFakeBackgroundEvent();
      bgEvent.data = {
        id: "123",
        action: "create"
      };

      // Call the handler
      const result = await handler(bgEvent);

      // Verify the response
      expect(result).toEqual({
        success: true,
        message: {
          id: "123",
          action: "create"
        },
        source: "pubsub"
      });
    });
  });

  describe("handleStorage", () => {
    it("should handle a Storage event", async () => {
      // Create a handler for the handleStorage method
      const handler = PlatformGCP.callback(BackgroundController, "handleStorage");

      // Create a background event with Storage format
      const bgEvent = createFakeBackgroundEvent();
      bgEvent.data = {
        bucket: "my-bucket",
        name: "path/to/file.txt",
        metageneration: "1",
        timeCreated: new Date().toISOString(),
        updated: new Date().toISOString()
      };

      // Call the handler
      const result = await handler(bgEvent);

      // Verify the response
      expect(result).toEqual({
        success: true,
        bucket: "my-bucket",
        file: "path/to/file.txt",
        source: "storage"
      });
    });
  });
});
