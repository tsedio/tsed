<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">

   <h1>Keycloak</h1>

[![Build & Release](https://github.com/tsedio/tsed/workflows/Build%20&%20Release/badge.svg)](https://github.com/tsedio/tsed/actions?query=workflow%3A%22Build+%26+Release%22)
[![PR Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/tsedio/tsed/blob/master/CONTRIBUTING.md)
[![Coverage Status](https://coveralls.io/repos/github/tsedio/tsed/badge.svg?branch=production)](https://coveralls.io/github/tsedio/tsed?branch=production)
[![npm version](https://badge.fury.io/js/%40tsed%2Fcommon.svg)](https://badge.fury.io/js/%40tsed%2Fcommon)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![backers](https://opencollective.com/tsed/tiers/badge.svg)](https://opencollective.com/tsed)

</div>

<div align="center">
  <a href="https://tsed.io/">Website</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tsed.io/getting-started/">Getting started</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://api.tsed.io/rest/slack/tsedio/tsed">Slack</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/TsED_io">Twitter</a>
</div>

<hr />

A package of Ts.ED framework to protect your resources with Keycloak. See website: https://tsed.io/tutorials/keycloak.html.

## Prerequisites

In order to use this package, the following requirements must be met.

- You already have an existing Keycloak instance running. If not you can download a distribution of your choice [here](https://www.keycloak.org/downloads).
- You created a client within your realm that is going to be connected with your Ts.ED application.
- The keycloak.json file of the client has been downloaded, otherwise click the Installation tab of the newly created client, select Keycloak OIDC JSON, and then click Download.

## Feature

Currently, `@tsed/keycloak` secures your Ts.ED application on top of the official [Keycloak Node.js adapter](https://www.keycloak.org/docs/latest/securing_apps/#_nodejs_adapter).

## Installation

Install the following packages.

```bash
npm install --save @tsed/keycloak
npm install --save keycloak-connect
```

> ℹ️ The keycloak-connect version should match the version of your Keycloak.

Store the `keycloak.json` file at `src/config/keycloak`.

## Configuration

Import `@tsed/keycloak` in `server.ts` file.

Provide the path of `keycloak.json` in keycloak config property as described below.

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/keycloak";

@Configuration({
  keycloak: {
    config: "src/config/keycloak/keycloak.json"
  }
})
export class Server {}
```

> ℹ️ If you don't provide a keycloak config path the package will look for it by default on the root directory of your project.

You can also pass the Keycloak configuration to your client directly.

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/keycloak";

@Configuration({
  keycloak: {
    config: {
      realm: "my-realm",
      "bearer-only": true,
      "auth-server-url": "http://localhost:8080",
      "ssl-required": "external",
      resource: "my-client",
      "verify-token-audience": true,
      "use-resource-role-mappings": true,
      "confidential-port": 0
    }
  }
})
export class Server {}
```

### Options

Keycloak options will be passed to the KeycloakConnect constructor of `keycloak-connect` package.

#### Web session store

Manage the authentication state on server side.

Install `express-session` as store.

```shell
npm -i express-session -D
```

> ℹ️ express-session should not be used for production.

Pass the store to the option property in keycloak configuration.

```typescript
import {Configuration} from "@tsed/di";
import {MemoryStore} from "express-session";
import "@tsed/keycloak";

@Configuration({
  keycloak: {
    options: {
      store: new MemoryStore()
    }
  }
})
export class Server {}
```

#### Scope

A custom scope value can also be passed to options.

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/keycloak";

@Configuration({
  keycloak: {
    options: {
      scope: "offline_access"
    }
  }
})
export class Server {}
```

#### Cookies

Authentication with cookies can be enabled as follows.

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/keycloak";

@Configuration({
  keycloak: {
    options: {
      cookies: true
    }
  }
})
export class Server {}
```

#### Additional URLs

[//]: # "TODO: summarize in own words"

By default, the middleware catches calls to /logout to send the user through a Keycloak-centric logout workflow.
This can be changed by specifying a logout configuration parameter.

Also, the middleware supports callbacks from the Keycloak console to log out a single session or all sessions.
By default, these type of admin callbacks occur relative to the root URL of / but can be changed by providing an admin
parameter.

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/keycloak";

@Configuration({
  keycloak: {
    middlewareOptions: {
      logout: "/logoff",
      admin: "/callbacks"
    }
  }
})
export class Server {}
```

## Protecting resources

This packages provides the `@UseKeycloakAuth()` decorator which can be used to protect resources.

The decorator will use the `protect()` method of the `keycloak-connect` package by default.

You can also use your own middleware functions which is explained below.

### Client roles

In the following example the adapter will verify if the requesting user has the client role `my-client-role`.

```typescript
import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {UseKeycloakAuth} from "@tsed/keycloak";

@Controller("/calendars")
export class CalendarCtrl {
  @Get()
  @UseKeycloakAuth({role: "my-client-role"})
  findAll(): string {
    return "This action returns all calendars";
  }
}
```

### Different client roles

To secure your resources with different client roles prefix the role name with the desired client name.

```typescript
@Controller("/calendars")
export class CalendarCtrl {
  @Get()
  @UseKeycloakAuth({role: "diffrent-client:different-client-role"})
  findAll(): string {
    return "This action returns all calendars";
  }
}
```

### Realm roles

If you want to protect a resource based on a realm role provide the `realm:` prefix to the role.

```typescript
@Controller("/calendars")
export class CalendarCtrl {
  @Get()
  @UseKeycloakAuth({role: "realm:admin"})
  findAll(): string {
    return "This action returns all calendars";
  }
}
```

[//]: # "TODO: show protection with custom middleware"
