---
meta:
  - name: description
    content: Use Passport.js with Express, TypeScript and Ts.ED. Passport is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application.
  - name: keywords
    content: ts.ed express typescript passport.js node.js javascript decorators
projects:
  - title: Kit Passport.js
    href: https://github.com/tsedio/tsed-example-passportjs
    src: /passportjs.png
  - title: Kit TypeORM
    href: https://github.com/tsedio/tsed-example-typeorm
    src: /typeorm.png
  - title: Kit Azure AD
    href: https://github.com/tsedio/tsed-example-passport-azure-ad
    src: /azure.png
---

# Passport.js

<Banner src="/passportjs.png" height="128" href="http://www.passportjs.org/"></Banner>

> Passport is an authentication middleware for Node.js.

Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application.
A comprehensive set of strategies support authentication using a username and password, Facebook, Twitter, and more.

<Projects type="projects"/>
  
## Installation

Before using Passport, we need to install the [Passport.js](https://www.npmjs.com/package/passport) and the Passport-local.

```bash
npm install --save passport
```

## Configure your server

Add this configuration to your server:

<<< @/tutorials/snippets/passport/server.ts

### UserInfo

By default Ts.ED use a UserInfo model to serialize and deserialize user in session:

```typescript
import {Format, Property} from "@tsed/schema";

export class UserInfo {
  @Property()
  id: string;

  @Property()
  @Format("email")
  email: string;

  @Property()
  password: string;
}
```

You can set your own UserInfo model by changing the passport server configuration:

```typescript
class CustomUserInfoModel {
  @Property()
  id: string;

  @Property()
  token: string;
}

@Configuration({
  componentsScan: [
    `${process.cwd()}/protocols/*.ts` // scan protocols directory
  ],
  passport: {
    userInfoModel: CustomUserInfoModel
  }
})
```

It's also possible to disable model serialize/deserialize by setting a false value to `userInfoModel` options.

## Create a new Protocol

A Protocol is a special Ts.ED service which is used to declare a Passport Strategy and handle Passport lifecycle.

Here is an example with the PassportLocal:

<Tabs class="-code">
  <Tab label="LoginLocalProtocol.ts">
  
<<< @/tutorials/snippets/passport/LoginLocalProtocol.ts

  </Tab>
  <Tab label="LoginLocalProtocol.spec.ts">
  
<<< @/tutorials/snippets/passport/LoginLocalProtocol.spec.ts

  </Tab>
</Tabs>

::: tip
For signup and basic flow you can checkout one of our examples:

<Projects type="projects"/>
:::

## Create the Passport controller

Create a new Passport controller as following:

<<< @/tutorials/snippets/passport/PassportCtrl.ts

This controller will provide all required endpoints that will be used by the different protocols.

## Protect a route

@@Authorize@@ and @@Authenticate@@ decorators can be used as a Guard to protect your routes.

<<< @/tutorials/snippets/passport/guard-ctrl.ts

## Basic Auth

It is also possible to use the Basic Auth. To do that, you have to create a Protocol based on `passport-http` strategy.

<<< @/tutorials/snippets/passport/BasicProtocol.ts

Then, add the protocol name on the @@Authorize@@ decorator:

<<< @/tutorials/snippets/passport/guard-basic-auth.ts

## Advanced Auth

### JWT

JWT auth scenario, for example, is different. The Strategy will produce a payload which contains data and JWT token. This information
isn't attached to the request and cannot be retrieved using the default Ts.ED decorator.

To solve it, the `@tsed/passport` has two decorators @@Arg@@ and @@Args@@ to get the argument given to the original verify function by the Strategy.

For example, the official `passport-jwt` documentation gives this javascript code to configure the strategy:

<<< @/tutorials/snippets/passport/OriginalJwtPassport.js

The example code can be written with Ts.ED as following:

<<< @/tutorials/snippets/passport/JwtProtocol.ts

### Azure Bearer Auth

Azure bearer uses another scenario which requires to return multiple arguments. The `$onVerify` method accepts an `Array` to return multiple values.

<<< @/tutorials/snippets/passport/AzureBearerProtocol.ts

### Discord Auth

Discord passport gives an example to refresh the token. To do that you have to create a new Strategy and register with the refresh function from `passport-oauth2-refresh` module.

Here is the JavaScript code:

<<< @/tutorials/snippets/passport/OriginalDiscordProtocol.js

Ts.ED provides a way to handle the strategy built by the `@tsed/passport` by using the `$onInstall` hook.

<<< @/tutorials/snippets/passport/DiscordProtocol.ts

### Facebook Auth

Facebook passport gives an example to use scope on routes (permissions). We'll see how we can configure a route with a mandatory `scope`.

Here is the corresponding Facebook protocol:

<<< @/tutorials/snippets/passport/FacebookProtocol.ts

::: tip Note
In order to use Facebook authentication, you must first create an app at Facebook Developers. When created, an app is assigned an App ID and an App Secret. Your application must also implement a redirect URL, to which Facebook will redirect users after they have approved access for your application.

The verify callback for Facebook authentication accepts `accessToken`, `refreshToken`, and `profile` arguments. `profile` will contain user profile information provided by Facebook; refer to User [Profile](http://www.passportjs.org/guide/profile/) for additional information.
:::

::: warning
For security reasons, the redirection URL must reside on the same host that is registered with Facebook.
:::

Then we have to implement routes as following:

<<< @/tutorials/snippets/passport/PassportFacebookCtrl.ts

::: tip Note
@@Authenticate@@ decorator accepts a second option to configure the `scope`. It is equivalent to `passport.authenticate('facebook', {scope: 'read_stream' })`
:::

## Roles

Roles access management isn't a part of Passport.js and Ts.ED doesn't provide a way to handle this because it is specific for each application.

This section will give basic examples to implement your own roles strategy access.

To begin we have to implement a middleware which will be responsible to check the user role:

<<< @/tutorials/snippets/passport/AcceptRolesMiddleware.ts

Then, we have to create a decorator `AcceptRoles`. This decorator will store the given roles and register the AcceptRolesMiddleware created before.

<<< @/tutorials/snippets/passport/acceptRoles.ts

Finally, we can use this decorator on an Endpoint like this:

<<< @/tutorials/snippets/passport/roles-usage.ts

## Catch Passport Exception <Badge text="6.18.0+" />

```typescript
import {Catch, ExceptionFilterMethods, PlatformContext} from "@tsed/common";
import {PassportException} from "@tsed/passport";

@Catch(PassportException)
export class PassportExceptionFilter implements ExceptionFilterMethods {
  async catch(exception: PassportException, ctx: PlatformContext) {
    const {response} = ctx;

    console.log(exception.name);
  }
}
```

## Decorators

<ApiList query="module == '@tsed/passport' && symbolType === 'decorator'" />

## Author

<GithubContributors users="['Romakita']"/>

## Maintainers <Badge text="Help wanted" />

<GithubContributors users="['Romakita']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
