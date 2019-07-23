# Ts.ED - Passport Azure Ad

Here an example project with Passport.js and Ts.ED framework.

See [Ts.ED](https://tsed.io) project for more information.

## Checkout

This repository provide getting started project example for each Ts.ED version since `v5.18.1`.

```bash
git checkout -b https://github.com/TypedProject/tsed-example-passport-azure-ad/tree/v5.18.1
```

To checkout another version just replace `v5.18.1` by the desired version.

## Install

> **Important!** Ts.ED requires Node >= 8, Express >= 4 and TypeScript >= 3.

```batch
npm install
```

## Run

```
npm start
```

## Auth

This implements the Azure Single Page App Auth.  The options are set in the:
 * `.env` file for the server in development environment:
 * Azure Application Settings for the server in the Azure environment
 * `environments/environment.*.ts` for the Angular client in the chosen environment
   * To start Angular in the chosen environment run `ng serve --port 4201 --configuration=dev` for `environment.dev.ts`

The options are:
1.  `UseScopeLevelAuth=true` - to enable (true) the use of scopes specified on the endpoints.  For example:

         @Get("/hello-auth-world")
         @OAuthBearer({"scopes": ["admin"]})
         importantAdminTask(@Req() request: Express.Request, @Res() response: Express.Response) {
             ...
         }

However this comes at the cost of needing to define an application scope and assigning users to that.  This is due to the way that Azure Active Directory currently works where at least one scope is required (that is, if there are endpoints that don't have explicit scopes then something needs to be sent to Azure AD for these).

If this option is true then the full set of possible scopes needs to be defined in `Scopes` in the server environment.  The first one should be the application one that all users need to be assigned to.

2. `UseScopeLevelAuth=false` - to disable (false) the use of scopes specified on the endpoints.  This means that the users only need to authenticate against an App registered in Azure AD.  But no API Endpoints need to be defined.

Azure - set up the App as per:
* https://docs.microsoft.com/en-us/azure/active-directory/develop/scenario-spa-app-registration

Azure - create App Registration
* `Azure > App Registrations > THE_APP > Expose an API` to create scopes (roles).  
* Add it to the app under `Azure > App Registrations > THE_APP > API Permissions`

Azure - set to use version 2 of token:
* `Azure > App > App Active Directory > App Registrations > Manifest` - set accessTokenAcceptedVersion=2

Roles - the scopes for an application need to be assigned to Users or Groups they belong to
* https://docs.microsoft.com/en-us/azure/active-directory/manage-apps/methods-for-assigning-users-and-groups

For TeD, users must be assigned to the 'ted.translations.search' scope.

There is an Azure developer's blog post on all this at https://joonasw.net/view/defining-permissions-and-roles-in-aad.

Copy the clientId that was created during the app registration process, and also the tennantId that is your organizations tennant.  Paste these in to a ~/.env file and as Azure Application Settings in your Application Service. 

Copy the scope(s) created and add them to the configuration in `Server.ts`.

## Contributing

You can make a PR directly on https://github.com/TypedProject/tsed-example-passport-azure-ad.

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/tiers/backer.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2019 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[travis]: https://travis-ci.org/
