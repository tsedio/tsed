import {Store} from "@tsed/core";
import {Controller, INJECTABLE_PROP} from "@tsed/di";
import {Post} from "@tsed/common";
import {Transactional} from "./transactional";
import {TransactionalInterceptor} from "@tsed/mikro-orm";

@Controller("/users")
export class UsersCtrl {
  @Post("/")
  @Transactional()
  create() {}
}

describe("@Transactional", () => {
  it("should decorate method", () => {
    expect(Store.from(UsersCtrl).get(INJECTABLE_PROP)).toEqual({
      create: {
        bindingType: "interceptor",
        propertyKey: "create",
        useType: TransactionalInterceptor
      }
    });
  });
});
