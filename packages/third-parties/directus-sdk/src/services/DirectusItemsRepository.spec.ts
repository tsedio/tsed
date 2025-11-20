import type {Item, MutationOptions} from "@directus/types";
import {inject} from "@tsed/di";
import {DITest} from "@tsed/di";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

import {DirectusContextService} from "./DirectusContextService.js";
import {DirectusItemsRepository} from "./DirectusItemsRepository.js";

vi.mock("@tsed/di", async () => {
  const actual = await vi.importActual("@tsed/di");
  return {
    ...actual,
    inject: vi.fn()
  };
});

// Test repository implementation
class TestRepository extends DirectusItemsRepository<TestItem, "test_collection"> {
  protected collection = "test_collection" as const;
}

type TestItem = Item & {
  id: string;
  name: string;
  email: string;
  status: string;
};

describe("DirectusItemsRepository", () => {
  let repository: TestRepository;
  let mockContextService: any;
  let mockItemsService: any;

  beforeEach(async () => {
    await DITest.create();

    mockItemsService = {
      createOne: vi.fn(),
      readOne: vi.fn(),
      updateOne: vi.fn(),
      readByQuery: vi.fn()
    };

    mockContextService = {
      getItemsService: vi.fn().mockResolvedValue(mockItemsService)
    };

    vi.mocked(inject).mockImplementation((token: any) => {
      if (token === DirectusContextService) {
        return mockContextService;
      }
      return {};
    });

    repository = new TestRepository();
  });

  afterEach(() => {
    DITest.reset();
    vi.clearAllMocks();
  });

  describe("getCollection()", () => {
    it("should call contextService.getItemsService with collection name", async () => {
      await repository.getCollection();

      expect(mockContextService.getItemsService).toHaveBeenCalledWith("test_collection");
    });

    it("should return items service", async () => {
      const result = await repository.getCollection();

      expect(result).toBe(mockItemsService);
    });
  });

  describe("create()", () => {
    it("should create item and return it", async () => {
      const data = {name: "John Doe", email: "john@example.com", status: "active"};
      const createdKey = "123";
      const createdItem: TestItem = {id: createdKey, ...data};

      mockItemsService.createOne.mockResolvedValue(createdKey);
      mockItemsService.readOne.mockResolvedValue(createdItem);

      const result = await repository.create(data);

      expect(mockItemsService.createOne).toHaveBeenCalledWith(data, undefined);
      expect(mockItemsService.readOne).toHaveBeenCalledWith(createdKey);
      expect(result).toEqual(createdItem);
    });

    it("should pass mutation options to createOne", async () => {
      const data = {name: "Jane Doe", email: "jane@example.com"};
      const options: MutationOptions = {
        emitEvents: false
      };
      const createdKey = "456";
      const createdItem: TestItem = {id: createdKey, ...data, status: "pending"};

      mockItemsService.createOne.mockResolvedValue(createdKey);
      mockItemsService.readOne.mockResolvedValue(createdItem);

      const result = await repository.create(data, options);

      expect(mockItemsService.createOne).toHaveBeenCalledWith(data, options);
      expect(result).toEqual(createdItem);
    });

    it("should handle partial data", async () => {
      const data = {name: "Partial User"};
      const createdKey = "789";
      const createdItem: TestItem = {id: createdKey, name: "Partial User", email: "", status: "draft"};

      mockItemsService.createOne.mockResolvedValue(createdKey);
      mockItemsService.readOne.mockResolvedValue(createdItem);

      const result = await repository.create(data);

      expect(mockItemsService.createOne).toHaveBeenCalledWith(data, undefined);
      expect(result).toEqual(createdItem);
    });

    it("should get collection before creating", async () => {
      const data = {name: "Test"};
      mockItemsService.createOne.mockResolvedValue("123");
      mockItemsService.readOne.mockResolvedValue({id: "123", ...data});

      await repository.create(data);

      expect(mockContextService.getItemsService).toHaveBeenCalled();
    });
  });

  describe("update()", () => {
    it("should update item and return it", async () => {
      const data = {id: "123", name: "Updated Name", email: "updated@example.com"};
      const updatedItem: TestItem = {...data, status: "active"};

      mockItemsService.updateOne.mockResolvedValue(data.id);
      mockItemsService.readOne.mockResolvedValue(updatedItem);

      const result = await repository.update(data);

      expect(mockItemsService.updateOne).toHaveBeenCalledWith(data.id, data, undefined);
      expect(mockItemsService.readOne).toHaveBeenCalledWith(data.id);
      expect(result).toEqual(updatedItem);
    });

    it("should pass mutation options to updateOne", async () => {
      const data = {id: "456", name: "Updated"};
      const options: MutationOptions = {
        emitEvents: true,
        bypassLimits: true
      };
      const updatedItem: TestItem = {id: "456", name: "Updated", email: "test@example.com", status: "active"};

      mockItemsService.updateOne.mockResolvedValue(data.id);
      mockItemsService.readOne.mockResolvedValue(updatedItem);

      const result = await repository.update(data, options);

      expect(mockItemsService.updateOne).toHaveBeenCalledWith(data.id, data, options);
      expect(result).toEqual(updatedItem);
    });

    it("should require id in data", async () => {
      const data = {id: "789", status: "inactive"};
      const updatedItem: TestItem = {id: "789", name: "Test", email: "test@test.com", status: "inactive"};

      mockItemsService.updateOne.mockResolvedValue(data.id);
      mockItemsService.readOne.mockResolvedValue(updatedItem);

      const result = await repository.update(data);

      expect(mockItemsService.updateOne).toHaveBeenCalledWith("789", data, undefined);
      expect(result).toEqual(updatedItem);
    });

    it("should get collection before updating", async () => {
      const data = {id: "123", name: "Test"};
      mockItemsService.updateOne.mockResolvedValue("123");
      mockItemsService.readOne.mockResolvedValue({...data, email: "", status: "active"});

      await repository.update(data);

      expect(mockContextService.getItemsService).toHaveBeenCalled();
    });
  });

  describe("listAll()", () => {
    it("should return all items", async () => {
      const items: TestItem[] = [
        {id: "1", name: "User 1", email: "user1@example.com", status: "active"},
        {id: "2", name: "User 2", email: "user2@example.com", status: "active"},
        {id: "3", name: "User 3", email: "user3@example.com", status: "inactive"}
      ];

      mockItemsService.readByQuery.mockResolvedValue(items);

      const result = await repository.listAll();

      expect(mockItemsService.readByQuery).toHaveBeenCalledWith({limit: -1});
      expect(result).toEqual(items);
    });

    it("should return empty array when no items", async () => {
      mockItemsService.readByQuery.mockResolvedValue([]);

      const result = await repository.listAll();

      expect(result).toEqual([]);
    });

    it("should use limit -1 for unlimited results", async () => {
      mockItemsService.readByQuery.mockResolvedValue([]);

      await repository.listAll();

      expect(mockItemsService.readByQuery).toHaveBeenCalledWith({limit: -1});
    });

    it("should get collection before listing", async () => {
      mockItemsService.readByQuery.mockResolvedValue([]);

      await repository.listAll();

      expect(mockContextService.getItemsService).toHaveBeenCalled();
    });
  });

  describe("Custom repository methods", () => {
    it("should allow extending with custom methods", async () => {
      class CustomRepository extends DirectusItemsRepository<TestItem, "test_collection"> {
        protected collection = "test_collection" as const;

        async getActiveUsers() {
          const collection = await this.getCollection();
          return collection.readByQuery({
            filter: {
              status: {
                _eq: "active"
              }
            }
          });
        }
      }

      const customRepo = new CustomRepository();
      // Mock inject for custom repository
      vi.mocked(inject).mockImplementation((token: any) => {
        if (token === DirectusContextService) {
          return mockContextService;
        }
        return {};
      });

      const activeItems = [{id: "1", name: "Active User", email: "active@example.com", status: "active"}];
      mockItemsService.readByQuery.mockResolvedValue(activeItems);

      const result = await customRepo.getActiveUsers();

      expect(mockItemsService.readByQuery).toHaveBeenCalledWith({
        filter: {
          status: {
            _eq: "active"
          }
        }
      });
      expect(result).toEqual(activeItems);
    });
  });

  describe("Type safety", () => {
    it("should enforce collection type at compile time", () => {
      // This test verifies TypeScript compilation
      // The collection property must be defined
      expect(repository["collection"]).toBe("test_collection");
    });

    it("should support typed items", async () => {
      type CustomItem = Item & {
        id: string;
        customField: string;
      };

      class CustomTypedRepository extends DirectusItemsRepository<CustomItem, "custom"> {
        protected collection = "custom" as const;
      }

      const typedRepo = new CustomTypedRepository();
      expect(typedRepo["collection"]).toBe("custom");
    });
  });

  describe("Error handling", () => {
    it("should propagate errors from getItemsService", async () => {
      const error = new Error("Failed to get items service");
      mockContextService.getItemsService.mockRejectedValue(error);

      await expect(repository.getCollection()).rejects.toThrow("Failed to get items service");
    });

    it("should propagate errors from createOne", async () => {
      const error = new Error("Creation failed");
      mockItemsService.createOne.mockRejectedValue(error);

      await expect(repository.create({name: "Test"})).rejects.toThrow("Creation failed");
    });

    it("should propagate errors from updateOne", async () => {
      const error = new Error("Update failed");
      mockItemsService.updateOne.mockRejectedValue(error);

      await expect(repository.update({id: "123", name: "Test"})).rejects.toThrow("Update failed");
    });

    it("should propagate errors from readByQuery", async () => {
      const error = new Error("Query failed");
      mockItemsService.readByQuery.mockRejectedValue(error);

      await expect(repository.listAll()).rejects.toThrow("Query failed");
    });
  });

  describe("Integration scenarios", () => {
    it("should support full CRUD workflow", async () => {
      // Create
      const newItem = {name: "New User", email: "new@example.com", status: "pending"};
      mockItemsService.createOne.mockResolvedValue("new-id");
      mockItemsService.readOne.mockResolvedValue({id: "new-id", ...newItem});
      const created = await repository.create(newItem);
      expect(created.id).toBe("new-id");

      // Update
      const updateData = {id: created.id, status: "active"};
      mockItemsService.updateOne.mockResolvedValue(created.id);
      mockItemsService.readOne.mockResolvedValue({...created, status: "active"});
      const updated = await repository.update(updateData);
      expect(updated.status).toBe("active");

      // List all
      mockItemsService.readByQuery.mockResolvedValue([updated]);
      const all = await repository.listAll();
      expect(all).toContainEqual(updated);
    });
  });
});
