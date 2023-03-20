import {DecoratorTypes, Store} from "@tsed/core";
import {Controller, INJECTABLE_PROP} from "@tsed/di";
import {MongoEntityManager} from "@mikro-orm/mongodb";
import {EntityManager} from "./entityManager";

@Controller("/users")
export class UsersCtrl {
  @EntityManager()
  public readonly em!: MongoEntityManager;
}

describe("@Orm", () => {
  it("should decorate property", () => {
    expect(Store.from(UsersCtrl).get(INJECTABLE_PROP)).toEqual({
      em: {
        propertyKey: "em",
        bindingType: DecoratorTypes.PROP,
        resolver: expect.any(Function)
      }
    });
  });
});
