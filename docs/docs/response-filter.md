---
meta:
  - name: description
    content: Documentation over response filters provided by Ts.ED framework. Use class to transform data before returning it to your consumer.
  - name: keywords
    content: response filter ts.ed express typescript node.js javascript decorators jsonschema class models
---

# Response Filter

Ts.ED response filter provide a @@ResponseFilter@@ decorator to decorate a class and handle data returned by the endpoint before sending it to your consumer.
The decorator take a `Content-Type` value to define when the class must be used to transform data to the expected result.

It's the right place to implement your own serialization logic. For example, you can define a Response filter to transform data to an XML content or wrap the data into another generic object.

With this decorator, you are able to define multiple Response Filter (but only by Content-Type). Ts.ED will choose the better
Response Filter according to the `Accept` HTTP header on the request object, when present, or fallback to the default Response filter.

## Xml Filter

By using the appropriate `Content-Type`, you can define a Xml serializer as following:

<Tabs class="-code">
<Tab label="XmlResponseFilter.ts" icon="bx-code-alt">

```typescript
import {ResponseFilter, Context, ResponseFilterMethods} from "@tsed/common";

@ResponseFilter("text/xml")
export class XmlResponseFilter implements ResponseFilterMethods {
  transform(data: any, ctx: Context) {
    return jsToXML(data);
  }
}
```

</Tab>
<Tab label="UserCtrl.ts" icon="bx-code-alt">

```typescript
import {Configuration} from "@tsed/common";
import {Returns} from "@tsed/schema";

@Controller("/users")
export class UsersCtrl {
  @Get("/:id")
  @Returns(200, User).ContentType("application/json")
  @Returns(200, String).ContentType("text/xml")
  async getUser(@PathParams("id") id: string) {
    return new User({id});
  }
}
```

</Tab>
<Tab label="Server.ts" icon="bxs-server">

```typescript
import {Configuration} from "@tsed/common";
import {XmlResponseFilter} from "./filters/XmlResponseFilter";

@Configuration({
  responseFilters: [
    XmlResponseFilter
  ]
})
```

</Tab>
<Tab label="UsersCtrl.spec.ts" icon="bx-test-tube">

```typescript
import {UsersCtrl} from "@tsed/common";
import * as SuperTest from "supertest";
import {UsersCtrl} from "./UsersCtrl";
import {Server} from "../../Server";

describe("UserCtrl", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(
    PlatformTest.bootstrap(Server, {
      mount: {
        "/rest": [UsersCtrl]
      },
      responseFilters: [XmlResponseFilter]
    })
  );
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);
  it("should return the xml format", async () => {
    const response = await request
      .get("/rest/users/1")
      .set({
        Accept: "text/xml"
      })
      .expect(200);

    expect(response.text).toEqual("<xml>...</xml>");
  });
  it("should return the default format", async () => {
    const response = await request.get("/rest/users/1").expect(200);

    expect(response.body).toEqual({id: "1"});
  });
});
```

</Tab>
</Tabs>

::: warning
Don't forget to register your Response Filter by adding your class to `responseFilters` field on the server configuration.
:::

## Wrap responses

One of the usage of the Response Filter could be to wrap all returned data into a generic object.
To doing that, use the `application/json` Content-Type with the @@ResponseFilter@@ decorator
to wrap data to the expected result:

<Tabs class="-code">
<Tab label="WrapperResponseFilter.ts" icon="bx-code-alt">

```typescript
import {ResponseFilter, Context, ResponseFilterMethods} from "@tsed/common";

@ResponseFilter("application/json")
export class WrapperResponseFilter implements ResponseFilterMethods {
  transform(data: any, ctx: Context) {
    return {data, errors: [], links: []};
  }
}
```

</Tab>
<Tab label="UserCtrl.ts" icon="bx-code-alt">

```typescript
import {Configuration} from "@tsed/common";
import {Returns} from "@tsed/schema";

@Controller("/users")
export class UsersCtrl {
  @Get("/:id")
  @Returns(200, User).ContentType("application/json")
  @Returns(200, String).ContentType("text/xml")
  async getUser(@PathParams("id") id: string) {
    return new User({id});
  }
}
```

</Tab>
<Tab label="Server.ts" icon="bxs-server">

```typescript
import {Configuration} from "@tsed/common";
import {WrapperResponseFilter} from "./filters/WrapperResponseFilter";

@Configuration({
  responseFilters: [
    WrapperResponseFilter
  ]
})
```

</Tab>
<Tab label="UsersCtrl.spec.ts" icon="bx-test-tube">

```typescript
import {UsersCtrl} from "@tsed/common";
import * as SuperTest from "supertest";
import {UsersCtrl} from "./UsersCtrl";
import {Server} from "../../Server";

describe("UserCtrl", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(
    PlatformTest.bootstrap(Server, {
      mount: {
        "/rest": [UsersCtrl]
      },
      responseFilters: [XmlResponseFilter]
    })
  );
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);
  it("should return the wrapped data", async () => {
    const response = await request.get("/rest/users/1").expect(200);

    expect(response.body).toEqual({data: {id: "1"}, errors: [], links: []});
  });
});
```

</Tab>
</Tabs>

::: warning
The wrapper won't be documented in your generated `swagger.json`!
:::

## Handle all responses

By using the `*/*` Content-Type value given to the @@ResponseFilter@@ you can intercept all data.

```typescript
import {ResponseFilter, Context, ResponseFilterMethods} from "@tsed/common";

@ResponseFilter("*/*")
export class AnyResponseFilter implements ResponseFilterMethods {
  transform(data: any, ctx: Context) {
    // do something
    return data;
  }
}
```

## Pagination

The following advanced example will show you how you can combine the different Ts.ED features to describe Pagination.
The used features are the following:

- [Generics](/docs/models.html#generics)
- [Function programming to declare models](/docs/models.html#using-functions)
- @@For@@ decorator to declare a custom model for JsonSchema, OS2 or OS3.
- [Response Filter](/docs/response-filter.md) to manage paginated response.

<Tabs class="-code">
  <Tab label="ProductsCtrl.ts">

<<< @/docs/snippets/model/pagination-ctrl.ts

  </Tab>  
  <Tab label="Pageable.ts">
  
<<< @/docs/snippets/model/pageable-model.ts

  </Tab>  
  <Tab label="Pagination.ts">
  
<<< @/docs/snippets/model/pagination-model.ts

  </Tab>
  <Tab label="Product.ts">
  
<<< @/docs/snippets/model/pageable-product-model.ts
  
  </Tab>
  <Tab label="PaginationFilter.ts">
  
<<< @/docs/snippets/model/pagination-filter.ts
  
  </Tab>
  <Tab label="ProductsCtrl.spec.ts">
  
<<< @/docs/snippets/model/pageable-product-model.ts
  
  </Tab>
</Tabs>
