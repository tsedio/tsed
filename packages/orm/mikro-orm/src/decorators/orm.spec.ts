import {DecoratorTypes, Store} from "@tsed/core";
import {Controller, INJECTABLE_PROP} from "@tsed/di";
import {Orm} from "@tsed/mikro-orm";
import {MikroORM} from "@mikro-orm/core";

@Controller("/users")
export class UsersCtrl {
  @Orm()
  public readonly orm!: MikroORM;
}

describe("@Orm", () => {
  it("should decorate property", () => {
    expect(Store.from(UsersCtrl).get(INJECTABLE_PROP)).toEqual({
      orm: {
        propertyKey: "orm",
        bindingType: DecoratorTypes.PROP,
        resolver: expect.any(Function)
      }
    });
  });
});
