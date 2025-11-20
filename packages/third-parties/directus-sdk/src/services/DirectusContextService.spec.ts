import type {EndpointExtensionContext, HookExtensionContext, Item, OperationContext} from "@directus/types";
import {context, DITest, inject} from "@tsed/di";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

import {DirectusContextService} from "./DirectusContextService.js";

vi.mock("@tsed/di", async () => {
  const actual = await vi.importActual("@tsed/di");
  return {
    ...actual,
    context: vi.fn()
  };
});

function getFixture() {
  const mockDIContext: any = {
    set: vi.fn(),
    get: vi.fn()
  };

  vi.mocked(context).mockReturnValue(mockDIContext);

  const service = inject(DirectusContextService);

  const mockContext: any = {
    logger: {
      info: vi.fn(),
      error: vi.fn()
    },
    getSchema: vi.fn().mockResolvedValue({
      collections: {},
      relations: []
    }),
    services: {
      ItemsService: class MockItemsService {
        constructor(
          public collection: string,
          public options: any
        ) {}
      }
    },
    database: {} as any,
    env: {}
  };

  return {
    mockContext,
    service,
    mockDIContext
  };
}

describe("DirectusContextService", () => {
  beforeEach(() => DITest.create());

  afterEach(async () => {
    await DITest.reset();
    vi.clearAllMocks();
  });

  describe("set()", () => {
    it("should set DirectusContext in DI context", () => {
      const {service, mockContext, mockDIContext} = getFixture();
      service.set(mockContext);

      expect(mockDIContext.set).toHaveBeenCalledWith("DIRECTUS_CONTEXT", mockContext);
    });

    it("should set endpoint context", () => {
      const {service, mockContext, mockDIContext} = getFixture();

      const endpointContext: EndpointExtensionContext = {
        ...mockContext,
        emitter: {} as any
      };

      service.set(endpointContext);

      expect(mockDIContext.set).toHaveBeenCalledWith("DIRECTUS_CONTEXT", endpointContext);
    });

    it("should set operation context", () => {
      const {service, mockContext, mockDIContext} = getFixture();

      const operationContext: OperationContext = {
        ...mockContext,
        data: {},
        accountability: null
      };

      service.set(operationContext);

      expect(mockDIContext.set).toHaveBeenCalledWith("DIRECTUS_CONTEXT", operationContext);
    });

    it("should set hook context", () => {
      const {service, mockContext, mockDIContext} = getFixture();

      const hookContext: HookExtensionContext = {
        ...mockContext,
        emitter: {} as any
      };

      service.set(hookContext);

      expect(mockDIContext.set).toHaveBeenCalledWith("DIRECTUS_CONTEXT", hookContext);
    });
  });

  describe("get()", () => {
    it("should get DirectusContext from DI context", () => {
      const {service, mockContext, mockDIContext} = getFixture();

      mockDIContext.get.mockReturnValue(mockContext);

      const result = service.get();

      expect(mockDIContext.get).toHaveBeenCalledWith("DIRECTUS_CONTEXT");
      expect(result).toBe(mockContext);
    });

    it("should return undefined when no context is set", () => {
      const {service, mockContext, mockDIContext} = getFixture();

      mockDIContext.get.mockReturnValue(undefined);

      const result = service.get();

      expect(result).toBeUndefined();
    });
  });

  describe("getItemsService()", () => {
    it("should create ItemsService for given collection", async () => {
      const {service, mockContext, mockDIContext} = getFixture();

      mockDIContext.get.mockReturnValue(mockContext);

      const result: any = await service.getItemsService("users");

      expect(mockContext.getSchema).toHaveBeenCalled();
      expect(result).toBeInstanceOf(mockContext.services.ItemsService);
      expect(result.collection).toBe("users");
    });

    it("should pass options to ItemsService", async () => {
      const {service, mockContext, mockDIContext} = getFixture();

      mockDIContext.get.mockReturnValue(mockContext);

      const options = {
        accountability: {user: "test-user"},
        knex: {} as any
      };

      const result: any = await service.getItemsService("posts", options);

      expect(result.options).toMatchObject(options);
      expect(result.options.schema).toBeDefined();
    });

    it("should throw error when no context is available", async () => {
      const {service, mockContext, mockDIContext} = getFixture();

      mockDIContext.get.mockReturnValue(undefined);

      await expect(service.getItemsService("users")).rejects.toThrow("No directus context available");
    });

    it("should throw error when context is null", async () => {
      const {service, mockContext, mockDIContext} = getFixture();

      mockDIContext.get.mockReturnValue(null);

      await expect(service.getItemsService("users")).rejects.toThrow("No directus context available");
    });

    it("should handle typed collections", async () => {
      const {service, mockContext, mockDIContext} = getFixture();

      type User = Item & {
        id: string;
        name: string;
        email: string;
      };

      mockDIContext.get.mockReturnValue(mockContext);

      const result: any = await service.getItemsService<User, "users">("users");

      expect(result.collection).toBe("users");
    });

    it("should merge options with schema", async () => {
      const {service, mockContext, mockDIContext} = getFixture();

      mockDIContext.get.mockReturnValue(mockContext);

      const schema = {collections: {users: {}}, relations: []};
      mockContext.getSchema.mockResolvedValue(schema);

      const customOptions = {limit: 10, offset: 0};
      const result: any = await service.getItemsService("users", customOptions);

      expect(result.options).toMatchObject({
        ...customOptions,
        schema
      });
    });

    it("should create ItemsService for different collections", async () => {
      const {service, mockContext, mockDIContext} = getFixture();

      mockDIContext.get.mockReturnValue(mockContext);

      const usersService: any = await service.getItemsService("users");
      const postsService: any = await service.getItemsService("posts");

      expect(usersService.collection).toBe("users");
      expect(postsService.collection).toBe("posts");
    });

    it("should handle empty options object", async () => {
      const {service, mockContext, mockDIContext} = getFixture();

      mockDIContext.get.mockReturnValue(mockContext);

      const result: any = await service.getItemsService("users", {});

      expect(result.options.schema).toBeDefined();
    });

    it("should await getSchema call", async () => {
      const {service, mockContext, mockDIContext} = getFixture();

      mockDIContext.get.mockReturnValue(mockContext);

      const schema = {collections: {}, relations: []};

      mockContext.getSchema.mockResolvedValue(schema);

      await service.getItemsService("users");

      expect(mockContext.getSchema).toHaveBeenCalled();
    });
  });

  describe("Integration scenarios", () => {
    it("should support full workflow: set context, get context, get items service", async () => {
      const {service, mockContext, mockDIContext} = getFixture();

      service.set(mockContext);
      mockDIContext.get.mockReturnValue(mockContext);

      const retrievedContext = service.get();
      expect(retrievedContext).toBe(mockContext);

      const itemsService: any = await service.getItemsService("products");
      expect(itemsService.collection).toBe("products");
    });

    it("should handle multiple contexts sequentially", async () => {
      const {service, mockContext, mockDIContext} = getFixture();

      const context1 = {...mockContext, env: {APP: "app1"}};
      const context2 = {...mockContext, env: {APP: "app2"}};

      service.set(context1);
      mockDIContext.get.mockReturnValue(context1);
      expect(service.get()).toBe(context1);

      service.set(context2);
      mockDIContext.get.mockReturnValue(context2);
      expect(service.get()).toBe(context2);
    });
  });
});
