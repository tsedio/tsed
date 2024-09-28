import {Model} from "objection";

import {Entity} from "./entity.js";
import {IdColumn} from "./idColumn.js";
import {RelatesTo} from "./relatesTo.js";

describe("@RelatesTo", () => {
  it("should set metadata", () => {
    @Entity("user")
    class User extends Model {
      @IdColumn()
      id!: string;
    }

    @Entity("movie")
    class Movie extends Model {
      @IdColumn()
      id!: string;
      userId!: string;
      @RelatesTo(Model.BelongsToOneRelation)
      user?: User;
    }
    expect(Movie.relationMappings).toEqual({
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "movie.userId",
          to: "user.id"
        }
      }
    });
  });
});
