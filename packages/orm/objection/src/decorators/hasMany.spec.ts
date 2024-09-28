import {Model} from "objection";

import {Entity} from "./entity.js";
import {HasMany} from "./hasMany.js";
import {IdColumn} from "./idColumn.js";

describe("@HasMany", () => {
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
      @HasMany(Pet)
      pets?: Pet[];
    }
    expect(User.relationMappings).toEqual({
      pets: {
        relation: Model.HasManyRelation,
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
      @HasMany(Pet, {from: "userId", to: "ownerId"})
      pets?: Pet[];
    }
    expect(User.relationMappings).toEqual({
      pets: {
        relation: Model.HasManyRelation,
        modelClass: Pet,
        join: {
          from: "user.userId",
          to: "pet.ownerId"
        }
      }
    });
  });
});
