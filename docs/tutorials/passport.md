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

> Passport is authentication middleware for Node.js.

Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application.
A comprehensive set of strategies support authentication using a username and password, Facebook, Twitter, and more.
  
<Projects type="examples"/>
  
## Installation

Before using the Passport, we need to install the [Passport.js](https://www.npmjs.com/package/passport) and the Passport-local.

```bash
npm install --save passport
```

## Configure your server

Add this configuration to your server:

<<< @/docs/tutorials/snippets/passport/server.ts

## Create a new Protocol

A Protocol is a special Ts.ED service which is used to declare a Passport Strategy and handle Passport lifecycle.

Here an example with the PassportLocal:

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

This controller will provide required all endpoints which will be used by the different protocols.

## Protect a route

@@Authorize@@ and @@Authenticate@@ decorator can be used as a Guard to protect your routes.

<<< @/docs/tutorials/snippets/passport/guard-ctrl.ts

## Basic Auth

It also possible to use the Basic Auth. To doing that, you have to create a Protocol based on `passport-http` strategy.

<<< @/examples/passportjs/src/protocols/BasicProtocol.ts

Then, add the protocol name on @@Authorize@@ decorator:

<<< @/docs/tutorials/snippets/passport/guard-basic-auth.ts

## Decorators

<ApiList query="module == '@tsed/passport' && symbolType === 'decorator'" />


