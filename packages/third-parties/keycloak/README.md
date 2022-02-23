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

Put the `keycloak.json` file of your client to `src/config/keycloak`.

## Configuration

Import `@tsed/keycloak` in `server.ts` file and configure it.

Provide the path to the `keycloak.json` file.

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

### Middleware configuration

Todo

## Protecting resources

Todo
