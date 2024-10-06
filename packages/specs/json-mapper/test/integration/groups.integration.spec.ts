import {CollectionOf, Groups, Property} from "@tsed/schema";

import {deserialize} from "../../src/utils/deserialize.js";
import {serialize} from "../../src/utils/serialize.js";

class Product {
  @Groups("!creation")
  id: string;

  @Property()
  label: string;

  @Groups("group.summary")
  price: number;

  @Groups("group.extended")
  description: string;

  @CollectionOf(String)
  @Groups("creation")
  tags: string[];
}

describe("Groups", () => {
  describe("deserialize", () => {
    it("should deserialize object without groups restriction", () => {
      const product = deserialize(
        {
          id: "id",
          label: "label",
          price: 100,
          description: "description"
        },
        {type: Product}
      );

      expect(product).toEqual({
        id: "id",
        label: "label",
        price: 100,
        description: "description"
      });
    });
    it("should deserialize object with groups restriction (empty array)", () => {
      const product = deserialize(
        {
          id: "id",
          label: "label",
          price: 100,
          description: "description"
        },
        {type: Product, groups: []}
      );

      expect(product).toEqual({
        id: "id",
        label: "label"
      });
    });
    it("should deserialize object with groups restriction (creation)", () => {
      const product = deserialize(
        {
          id: "id",
          label: "label",
          price: 100,
          description: "description"
        },
        {type: Product, groups: ["creation"]}
      );

      expect(product).toEqual({
        label: "label"
      });
    });
    it("should deserialize object with groups restriction (groups.summary)", () => {
      const product = deserialize(
        {
          id: "id",
          label: "label",
          price: 100,
          description: "description"
        },
        {type: Product, groups: ["group.summary"]}
      );

      expect(product).toEqual({
        id: "id",
        label: "label",
        price: 100
      });
    });
    it("should deserialize object with groups restriction (group.*)", () => {
      const product = deserialize(
        {
          id: "id",
          label: "label",
          price: 100,
          description: "description"
        },
        {type: Product, groups: ["group.*"]}
      );

      expect(product).toEqual({
        id: "id",
        label: "label",
        price: 100,
        description: "description"
      });
    });
    it("should deserialize object without array data (update)", () => {
      class CustomRequest {
        @CollectionOf(String)
        @Groups("creation")
        a?: string[];

        @Groups("creation")
        b?: string;
      }

      const req = {a: "a", b: "b"};

      const res = deserialize(req, {type: CustomRequest, groups: ["update"]});
      expect(res).toEqual({});
    });
  });
  describe("serialize", () => {
    const product = deserialize(
      {
        id: "id",
        label: "label",
        price: 100,
        description: "description"
      },
      {type: Product}
    );

    it("should serialize object without groups restriction", () => {
      expect(serialize(product)).toEqual({
        id: "id",
        label: "label",
        price: 100,
        description: "description"
      });
    });
    it("should serialize object with groups restriction (empty array)", () => {
      expect(serialize(product, {groups: []})).toEqual({
        id: "id",
        label: "label"
      });
    });
    it("should serialize object with groups restriction (creation)", () => {
      expect(serialize(product, {groups: ["creation"]})).toEqual({
        label: "label"
      });
    });
    it("should serialize object  with groups restriction (groups.summary)", () => {
      expect(serialize(product, {groups: ["group.summary"]})).toEqual({
        id: "id",
        label: "label",
        price: 100
      });
    });
    it("should deserialize object  with groups restriction (group.*)", () => {
      expect(serialize(product, {groups: ["group.*"]})).toEqual({
        id: "id",
        label: "label",
        price: 100,
        description: "description"
      });
    });
  });
});
