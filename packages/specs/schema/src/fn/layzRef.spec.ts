import "../index.js";

import {CollectionOf} from "../decorators/collections/collectionOf.js";
import {Property} from "../decorators/common/property.js";
import {array} from "./collection.js";
import {lazyRef} from "./lazyRef.js";
import {object} from "./object.js";

describe("lazyRef", () => {
  it("should declare a lazyRef", () => {
    const schema1 = object({
      owners: array().items(lazyRef(() => Owner))
    });

    class Post {
      @Property()
      id: string;

      @Property(() => Owner)
      owner: typeof Owner;
    }

    class Owner {
      @Property()
      id: string;

      @CollectionOf(() => Post)
      posts: Post[];
    }

    expect(schema1.toJSON()).toEqual({
      definitions: {
        Owner: {
          properties: {
            id: {
              type: "string"
            },
            posts: {
              items: {
                $ref: "#/definitions/Post"
              },
              type: "array"
            }
          },
          type: "object"
        },
        Post: {
          properties: {
            id: {
              type: "string"
            },
            owner: {
              $ref: "#/definitions/Owner"
            }
          },
          type: "object"
        }
      },
      properties: {
        owners: {
          items: {
            $ref: "#/definitions/Owner"
          },
          type: "array"
        }
      },
      type: "object"
    });
  });
});
