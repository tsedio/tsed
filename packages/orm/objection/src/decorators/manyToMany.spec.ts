import {Model} from "objection";

import {Entity} from "./entity.js";
import {IdColumn} from "./idColumn.js";
import {ManyToMany} from "./manyToMany.js";

describe("@ManyToMany", () => {
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
      @ManyToMany(Pet)
      pets?: Pet[];
    }
    expect(User.relationMappings).toEqual({
      pets: {
        relation: Model.ManyToManyRelation,
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
      @ManyToMany(Pet, {
        from: "userId",
        through: {from: "user_pet.ownerId", to: "user_pet.petId"},
        to: "petId"
      })
      pets?: Pet[];
    }
    expect(User.relationMappings).toEqual({
      pets: {
        relation: Model.ManyToManyRelation,
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
