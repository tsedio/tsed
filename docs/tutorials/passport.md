---
meta:
 - name: description
   content: Use Passport.js with Express, TypeScript and Ts.ED. Passport is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application.
 - name: keywords
   content: ts.ed express typescript passport.js node.js javascript decorators
projects:   
 - title: Kit Passport.js
   href: https://github.com/TypedProject/tsed-example-passportjs
   src: /passportjs.png
 - title: Kit TypeORM
   href: https://github.com/TypedProject/tsed-example-typeorm
   src: /typeorm.png
 - title: Kit Azure AD
   href: https://github.com/TypedProject/tsed-example-passport-azure-ad
   src: /azure.png        
---
# Passport.js

<Banner class="--darken" src="http://www.passportjs.org/images/logo.svg" height="128" href="http://www.passportjs.org/"></Banner>

> Passport is an authentication middleware for Node.js.

Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application.
A comprehensive set of strategies support authentication using a username and password, Facebook, Twitter, and more.
  
<Projects type="examples"/>
  
## Installation

Before using Passport, we need to install the [Passport.js](https://www.npmjs.com/package/passport) and the Passport-local.

```bash
npm install --save passport
```

## Configure your server

Add this configuration to your server:

<<< @/docs/tutorials/snippets/passport/server.ts

## Create a new Protocol

A Protocol is a special Ts.ED service which is used to declare a Passport Strategy and handle Passport lifecycle.

Here is an example with the PassportLocal:

<Tabs class="-code">
  <Tab label="LoginLocalProtocol.ts">
  
<<< @/examples/passportjs/src/protocols/LoginLocalProtocol.ts

  </Tab>
  <Tab label="LoginLocalProtocol.spec.ts">
  
<<< @/examples/passportjs/src/protocols/LoginLocalProtocol.spec.ts

  </Tab>  
</Tabs>  

::: tip
For signup and basic flow you can checkout one of our examples:

<Projects type="examples"/>
:::

## Create the Passport controller

Create a new Passport controller as following:

<<< @/docs/tutorials/snippets/passport/PassportCtrl.ts

This controller will provide all required endpoints that will be used by the different protocols.

## Protect a route

@@Authorize@@ and @@Authenticate@@ decorators can be used as a Guard to protect your routes.

<<< @/docs/tutorials/snippets/passport/guard-ctrl.ts

## Basic Auth

It is also possible to use the Basic Auth. To do that, you have to create a Protocol based on `passport-http` strategy.

<<< @/examples/passportjs/src/protocols/BasicProtocol.ts

Then, add the protocol name on the @@Authorize@@ decorator:

<<< @/docs/tutorials/snippets/passport/guard-basic-auth.ts

## Advanced Auth
### JWT

JWT auth scenario, for example, is different. The Strategy will produce a payload which contains data and JWT token. This information
isn't attached to the request and cannot be retrieved using the default Ts.ED decorator.

To solve it, the `@tsed/passport` has two decorators @@Arg@@ and @@Args@@ to get the argument given to the original verify function by the Strategy.

For example, the official `passport-jwt` documentation gives this javascript code to configure the strategy:

<<< @/docs/tutorials/snippets/passport/OriginalJwtPassport.js

The example code can be written with Ts.ED as following:

<<< @/docs/tutorials/snippets/passport/JwtProtocol.ts

### Azure Bearer Auth

Azure bearer uses another scenario which requires to return multiple arguments. The `$onVerify` method accepts an `Array` to return multiple values.

<<< @/docs/tutorials/snippets/passport/AzureBearerProtocol.ts

### Discord Auth

Discord passport gives an example to refresh the token. To do that you have to create a new Strategy and register with the refresh function from `passport-oauth2-refresh` module.

Here is the JavaScript code:

<<< @/docs/tutorials/snippets/passport/OriginalDiscordProtocol.js

Ts.ED provides a way to handle the strategy built by the `@tsed/passport` by using the `$onInstall` hook.

<<< @/docs/tutorials/snippets/passport/DiscordProtocol.ts

### Facebook Auth

Facebook passport gives an example to use scope on routes (permissions). We'll see how we can configure a route with a mandatory `scope`.

Here is the corresponding Facebook protocol:

<<< @/docs/tutorials/snippets/passport/FacebookProtocol.ts

::: tip Note
In order to use Facebook authentication, you must first create an app at Facebook Developers. When created, an app is assigned an App ID and an App Secret. Your application must also implement a redirect URL, to which Facebook will redirect users after they have approved access for your application.

The verify callback for Facebook authentication accepts `accessToken`, `refreshToken`, and `profile` arguments. `profile` will contain user profile information provided by Facebook; refer to User [Profile](http://www.passportjs.org/guide/profile/) for additional information.
:::

::: warning
For security reasons, the redirection URL must reside on the same host that is registered with Facebook.
:::

Then we have to implement routes as following:

<<< @/docs/tutorials/snippets/passport/PassportFacebookCtrl.ts

::: tip Note
@@Authenticate@@ decorator accepts a second option to configure the `scope`. It is equivalent to `passport.authenticate('facebook', {scope: 'read_stream' })`
:::

## Roles

Roles access management isn't a part of Passport.js and Ts.ED doesn't provide a way to handle this because it is specific for each application.

This section will give basic examples to implement your own roles strategy access.

To begin we have to implement a middleware which will be responsible to check the user role:

<<< @/docs/tutorials/snippets/passport/AcceptRolesMiddleware.ts

Then, we have to create a decorator `AcceptRoles`. This decorator will store the given roles and register the AcceptRolesMiddleware created before.

<<< @/docs/tutorials/snippets/passport/acceptRoles.ts

Finally, we can use this decorator on an Endpoint like this:

<<< @/docs/tutorials/snippets/passport/roles-usage.ts

## Decorators

<ApiList query="module == '@tsed/passport' && symbolType === 'decorator'" />

## Author 

<GithubContributors users="['Romakita']"/>

## Maintainers <Badge text="Help wanted" />

<GithubContributors users="['Romakita']"/>

<div class="container--centered container--padded">
<a href="/contributing.html" class="nav-link button">
 Become maintainer
</a>
</div>