# Passport.js

> Passport is authentication middleware for Node.js. 
Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application.
A comprehensive set of strategies support authentication using a username and password, Facebook, Twitter, and more.
  
### Installation

Before using the Passport, we need to install the [Passport.js](https://www.npmjs.com/package/passport) and the Passport-local.

```bash
npm install --save passport
```

### Override AuthenticatedMiddleware

The annotation [`@Authenticated()`](api/common/mvc/authenticated.md) use the [`AuthenticatedMiddleware`](api/common/mvc/authenticatedmiddleware.md) 
to check the authentication strategy.

So, create a new file in your middlewares directory and past this code:

```typescript
import {OverrideMiddleware, AuthenticatedMiddleware} from "ts-express-decorators";
import {Forbidden} from "ts-httpexceptions";

@OverrideMiddleware(AuthenticatedMiddleware)
export class MyAuthenticatedMiddleware implements IMiddleware {
    public use(@EndpointInfo() endpoint: EndpointMetadata,
               @Request() request: Express.Request,
               @Next() next: Express.NextFunction) { // next is optional here
        
        // options given to the @Authenticated decorator
        const options = endpoint.get(AuthenticatedMiddleware) || {};
        // options => {role: 'admin'}
        
        if (!request.isAuthenticated()) { // passport.js
          throw new Forbidden("Forbidden")  
        }
        
        next();
    }
}
```

### Local strategy

Now, we need to expose some routes to enable the login, the signup and the logout. To do that, 
we'll use the passport-local strategy and we create a passport service and a passport controller.

#### The PassportLocalService

In the service directory, we'll create the `PassportLocalServices.ts` and write this code:

```typescript
import * as Passport from "passport";
import {Strategy} from "passport-local";
import {Service, BeforeRoutesInit, AfterRoutesInit} from "ts-express-decorators";
import {UserService} from "./UserService"; // other service that manage the users account

@Service()
export class PassportLocalService implements BeforeRoutesInit, AfterRoutesInit {

    constructor(private serverSettings: ServerSettingsService,
                private userService: UserService,
                @Inject(ExpressApplication) private  expressApplication: ExpressApplication) {

    }
    
    $beforeRoutesInit() {
        const options: any = this.serverSettings.get("passport") || {} as any;
        const {userProperty, pauseStream} = options; // options stored with ServerSettings

        this.expressApplication.use(Passport.initialize({userProperty}));
        this.expressApplication.use(Passport.session({pauseStream}));
    }

    $afterRoutesInit() {
        this.initializeSignup();
        this.initializeLogin();
    }
}
```
> We use the hook service licecycle to autoloading some actions when the server start. 
See the [service lifecycle](docs/services/lifecyle-hooks.md) for more informations.

#### Passport controller

We'll need to prepare some routes. To work it, the Passport need 3 routes:

- `/login`, email and password will be sent in the body request,
- `/signup`, email, password and optional information will be sent in the body request,
- `/logout`.

So create the `PassportCtrl` in the controllers directory and put this code:

```typescript
"use strict";

import * as Express from "express";
import {BodyParams, Controller, Get, Post, Req, Required, Res} from "ts-express-decorators";

@Controller("/passport")
export class PassportCtrl {

    @Post("/login")
    async login(@Required() @BodyParams("email") email: string,
                @Required() @BodyParams("password") password: string,
                @Req() request: Express.Request,
                @Res() response: Express.Response) {

    }

    @Post("/signup")
    async signup(@Required() @BodyParams("email") email: string,
                 @Required() @BodyParams("password") password: string,
                 @Required() @BodyParams("firstName") firstName: string,
                 @Required() @BodyParams("lastName") lastName: string,
                 @Req() request: Express.Request,
                 @Res() response: Express.Response) {

    }

    @Get("/logout")
    public logout(@Req() request: Express.Request): string {
        
    }

}
```

#### Signup

We will use Passport to register the signup action with the LocalStrategy. Passport will call back the handler when the 
the PassportCtrl call the `Passport.authenticate('signup')` method.

In the PassportCtrl, we need to implement the `Passport.authenticate('signup')` like this:

```typescript
import * as Express from "express";
import * as Passport from "passport";
import {BodyParams, Controller, Get, Post, Req, Required, Res} from "ts-express-decorators";
import {IUser} from "../../interfaces/User";

@Controller("/passport")
export class PassportCtrl {

    @Post("/signup")
    async signup(@Required() @BodyParams("email") email: string,
                 @Required() @BodyParams("password") password: string,
                 @Required() @BodyParams("firstName") firstName: string,
                 @Required() @BodyParams("lastName") lastName: string,
                 @Req() request: Express.Request,
                 @Res() response: Express.Response) {
        return new Promise((resolve, reject) => {

            Passport.authenticate("signup", (err, user: IUser) => {

                if (err) {
                    return reject(err);
                }

                if (!user) {
                    return reject(!!err);
                }

                request.logIn(user, (err) => {

                    if (err) {
                        return reject(err);
                    }
                    resolve(user);
                });
            })(request, response, () => {

            });
        });
    }
}
```
> Now, when a Request is sent to the signup route, Passport will emit a signup event.

In your PassportLocalService, we able to implement the Passport Local strategy on the signup event.

```typescript
import * as Passport from "passport";
import {Strategy} from "passport-local";
import {Service, BeforeRoutesInit, AfterRoutesInit} from "ts-express-decorators";
import {BadRequest} from "ts-httpexceptions";

@Service()
export class PassportLocalService implements BeforeRoutesInit, AfterRoutesInit {

    //...
    
    public initializeSignup() {

        Passport
            .use("signup", new Strategy({
                    // by default, local strategy uses username and password, we will override with email
                    usernameField: "email",
                    passwordField: "password",
                    passReqToCallback: true // allows us to pass back the entire request to the callback
                },
                (req, email, password, done) => {
                    const {firstName, lastName} = req.body;
                    // asynchronous
                    // User.findOne wont fire unless data is sent back
                    process.nextTick(() => {
                        this.signup({
                            firstName,
                            lastName,
                            email,
                            password
                        })
                            .then((user) => done(null, user))
                            .catch((err) => done(err));
                    });
                }));

    }

    /**
     *
     * @param user
     * @returns {Promise<any>}
     */
    async signup(user: IUser) {

        const exists = await this.usersService.findByEmail(user.email);

        if (exists) { //User exists
            throw new BadRequest("Email is already registered");
        }
        
        // Promise

        // Create new User
        return await this.usersService.create(<any>{
            email: user.email,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName
        });
    }
}
```
> We'll not implement the userService. We'll assume that it'll do what is expected.


#### Login

Implement login is the same principle that the signup. In the controller we need to use the `Passport.authenticate("login")`
method to emit the `login` event to each Passport Strategy.

```typescript
import * as Express from "express";
import * as Passport from "passport";
import {BodyParams, Controller, Get, Post, Req, Required, Res} from "ts-express-decorators";
import {IUser} from "../../interfaces/User";

@Controller("/passport")
export class PassportCtrl {

    @Post("/login")
    async login(@Required() @BodyParams("email") email: string,
                @Required() @BodyParams("password") password: string,
                @Req() request: Express.Request,
                @Res() response: Express.Response) {


        return new Promise<IUser>((resolve, reject) => {
            Passport
                .authenticate("login", (err, user: IUser) => {
                    if (err) {
                        reject(err);
                    }

                    request.logIn(user, (err) => {

                        if (err) {
                            reject(err);
                        } else {
                            resolve(user);
                        }
                    });

                })(request, response, () => {

                });
        });

    }
}
```

In your service we can do that:

```typescript

import * as Passport from "passport";
import {Strategy} from "passport-local";
import {Service, BeforeRoutesInit, AfterRoutesInit} from "ts-express-decorators";
import {BadRequest, NotFound} from "ts-httpexceptions";

@Service()
export class PassportLocalService implements BeforeRoutesInit, AfterRoutesInit {

    //...
    public initializeLogin() {
        Passport.use("login", new Strategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true // allows us to pass back the entire request to the callback
        }, (req, email, password, done) => {
            this.login(email, password)
                .then((user) => done(null, user))
                .catch((err) => done(err));
        }));
    }
    
    async login(email: string, password: string): Promise<IUser> {
        const user = await this.usersService.findByCredential(email, password);
        if (user) {
            return user;
        }

        throw new NotFound("User not found");
    }
}
```

#### Logout

Logout is very short, just place this code in the PassportCtrl and it's done:

```typescript
import * as Express from "express";
import {BodyParams, Controller, Get, Post, Req, Required, Res} from "ts-express-decorators";
import {IUser} from "../../interfaces/User";

@Controller("/passport")
export class PassportCtrl {
    @Get("/logout")
    public logout(@Req() request: Express.Request): string {
        request.logout();
        return "Disconnected";
    }
}
```

> You can find all source of this tutorial on [https://github.com/Romakita/example-ts-express-decorator/tree/2.0.0/example-passport](https://github.com/Romakita/example-ts-express-decorator/tree/2.0.0/example-passport)

<div class="guide-links">
<a href="#/tutorials/ajv">Validation with AJV</a>
<a href="#/tutorials/socket-io">Socket.io</a>
</div>