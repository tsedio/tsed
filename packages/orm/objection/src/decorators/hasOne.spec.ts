import {Model} from "objection";

import {Entity} from "./entity.js";
import {HasOne} from "./hasOne.js";
import {IdColumn} from "./idColumn.js";

describe("@HasOne", () => {
  it("should set metadata", () => {
    @Entity("pet")
    class Pet extends Model {
      @IdColumn()
      id!: string;
      userId?: string;
    }

    @Entity("user")
    class User extends Model {
      @IdColumn()
      id!: string;
      @HasOne()
      pet?: Pet;
    }
    expect(User.relationMappings).toEqual({
      pet: {
        relation: Model.HasOneRelation,
        modelClass: Pet,
        join: {
          from: "user.id",
          to: "pet.userId"
        }
      }
    });
  });
  it("should set custom relationship path", () => {
    @Entity("pet")
    class Pet extends Model {
      @IdColumn()
      id!: string;
      ownerId?: string;
    }
    @Entity("user")
    class User extends Model {
      @IdColumn()
      id!: string;
      userId!: string;
      @HasOne({from: "userId", to: "ownerId"})
      pet?: Pet;
    }
    expect(User.relationMappings).toEqual({
      pet: {
        relation: Model.HasOneRelation,
        modelClass: Pet,
        join: {
          from: "user.userId",
          to: "pet.ownerId"
        }
      }
    });
  });
});
