import {ROUTE_NODE_KIND, RouteNode} from "./RouteNode.js";

function root() {
  return new RouteNode<string>(ROUTE_NODE_KIND.STATIC, "/");
}

describe("RouteNode", () => {
  describe("createStatic", () => {
    it("should return the node itself for an empty text", () => {
      const node = root();

      expect(node.createStatic("", 0)).toBe(node);
    });

    it("should create a single node holding the whole text", () => {
      const node = root();
      const child = node.createStatic("users/list", 0);

      expect(child.prefix).toBe("users/list");
      expect(node.findStatic("/users/list", 1)).toBe(child);
    });

    it("should reuse an existing node for the same text", () => {
      const node = root();

      expect(node.createStatic("users", 0)).toBe(node.createStatic("users", 1));
    });

    it("should split a node on a partial prefix match", () => {
      const node = root();
      const users = node.createStatic("users", 0);
      const user = node.createStatic("user", 1);
      const head = node.findStatic("/user", 1)!;

      expect(head.prefix).toBe("user");
      expect(user).toBe(head);
      expect(users.prefix).toBe("s");
      expect(head.findStatic("/users", 5)).toBe(users);
    });

    it("should split when two texts diverge inside a prefix", () => {
      const node = root();
      const a = node.createStatic("abcd", 0);
      const b = node.createStatic("abxy", 1);
      const head = node.findStatic("/abcd", 1)!;

      expect(head.prefix).toBe("ab");
      expect(head.findStatic("/abcd", 3)).toBe(a);
      expect(head.findStatic("/abxy", 3)).toBe(b);
      expect([a.prefix, b.prefix]).toEqual(["cd", "xy"]);
    });

    it("should keep the lowest declaration index in every node of the path", () => {
      const node = root();
      node.createStatic("abcd", 5);
      node.createStatic("abxy", 2);
      const head = node.findStatic("/abcd", 1)!;

      expect(head.min).toBe(2);
      expect(head.findStatic("/abcd", 3)!.min).toBe(5);
      expect(head.findStatic("/abxy", 3)!.min).toBe(2);
    });

    it("should keep the lowest index of the split child on the new head", () => {
      const node = root();
      node.createStatic("users", 1);
      node.createStatic("user", 7);

      expect(node.findStatic("/user", 1)!.min).toBe(1);
    });
  });

  describe("findStatic", () => {
    it("should return null when no child starts with the char", () => {
      const node = root();
      node.createStatic("users", 0);

      expect(node.findStatic("/posts", 1)).toBeNull();
    });

    it("should return null when the first char matches but the prefix does not", () => {
      const node = root();
      node.createStatic("users", 0);

      expect(node.findStatic("/usxrs", 1)).toBeNull();
      expect(node.findStatic("/us", 1)).toBeNull();
    });

    it("should match a single char prefix on its first char", () => {
      const node = root();
      const child = node.createStatic("a", 0);

      expect(node.findStatic("/a", 1)).toBe(child);
    });
  });
});
