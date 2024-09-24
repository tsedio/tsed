import {Model} from "objection";

import {Entity} from "./entity.js";
import {HasOneThroughRelation} from "./hasOneThroughRelation.js";
import {IdColumn} from "./idColumn.js";

describe("@HasOneThroughRelation", () => {
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
      @HasOneThroughRelation()
      pet?: Pet;
    }
    expect(User.relationMappings).toEqual({
      pet: {
        relation: Model.HasOneThroughRelation,
        modelClass: Pet,
        join: {
          from: "user.id",
          through: {
            from: "user_pet.userId",
            to: "user_pet.petId"
          },
          to: "pet.id"
        }
      }
    });
  });
  it("should set custom relationship path", () => {
    @Entity("pet")
    class Pet extends Model {
      @IdColumn()
      id!: string;
      petId?: string;
    }
    @Entity("user")
    class User extends Model {
      @IdColumn()
      id!: string;
      userId!: string;
      @HasOneThroughRelation({
        from: "userId",
        through: {from: "user_pet.ownerId", to: "user_pet.petId"},
        to: "petId"
      })
      pet?: Pet;
    }
    expect(User.relationMappings).toEqual({
      pet: {
        relation: Model.HasOneThroughRelation,
        modelClass: Pet,
        join: {
          from: "user.userId",
          through: {
            from: "user_pet.ownerId",
            to: "user_pet.petId"
          },
          to: "pet.petId"
        }
      }
    });
  });
});
