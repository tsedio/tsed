---
meta:
 - name: description
   content: Session configuration 
 - name: keywords
   content: ts.ed express typescript auth node.js javascript decorators
---
# Session & cookies

Ts.ED provide two decorators to get [Session](/api/common/filters/decorators/session.md) and [Cookies](/api/common/filters/decorators/cookies.md) values in your controller.

## Installation

Before using the Session and Cookies, we need to install the a module like [express-session](https://www.npmjs.com/package/express-session) but 
you can use another module which follow the same convention. 

```bash
npm install --save express-session
```

## Configuration

Edit your Server and add these lines:
```typescript
import {ServerSettings, ServerLoader} from "@tsed/common";

@ServerSettings({})
class Server extends ServerLoader {
  
  /**
   * This method let you configure the express middleware required by your application to works.
   * @returns {Server}
   */
  public $onMountingMiddlewares(): void|Promise<any> {
   
    const expressSession = require('express-session');
 
    this.set('trust proxy', 1) ;
    this.use(expressSession({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: { 
        secure: false  // `true` require HTTPS. Set `false` if you reach the server with HTTP
      }
    }));
 
    return null;
  }
}
```

## Usage
### Session

```typescript
import {Session, Controller, Post} from "@tsed/common";

@Controller('/')
class MyCtrl {
  @Post('/')
  create(@Session() session: Express.Session) {
    console.log('Entire session', session);
    session.user = {}
  }
  
  @Post('/')
  create(@Session('id') id: string) { 
    // Read value
    console.log('Session ID', id);
  }
}
```

### Cookies 
```typescript
import {Cookies, Controller, Post} from "@tsed/common";
@Controller('/')
class MyCtrl {
  @Post('/')
  create(@Cookies() cookies: any) {
    console.log('Entire cookies', cookies);
  }
  
  @Post('/')
  create(@Cookies('id') id: string) {
    console.log('ID', id);
  }
  
  @Post('/')
  create(@Cookies('user') user: IUser) {
    console.log('user', user);
  }
}
```

## Initialize session

Sometime we want to be sure that the session is correctly initialized with the right values. We have three way to initialize the session.
We can register a middleware on server level, controller level or endpoint level (controller method).

Let's start, by creating the middleware InitSessionMiddleware in `middlewares` directory:

```typescript
import {Middleware, Request} from "@tsed/common";
import {IUser} from "../models/User";

declare global {
  namespace Express {
    interface Session {
      user: IUser;
    }
  }
}

@Middleware()
export class InitSessionMiddleware {
  use(@Request() request: Express.Request) {
    if (request.session) {
      request.session.user = request.session.user || {
        id: null
      };
    }
   // Check other stuff
  }
}
```

Then, add this middleware on the server:

```typescript
import {ServerSettings, ServerLoader} from "@tsed/common";
import {InitSessionMiddleware} from "./middlewares/InitSessionMiddleware"

@ServerSettings({

})
class Server extends ServerLoader {
  
  /**
   * This method let you configure the express middleware required by your application to works.
   * @returns {Server}
   */
  public $onMountingMiddlewares(): void|Promise<any> {
   
    const expressSession = require('express-session');
 
    this.set('trust proxy', 1) ;
    this.use(expressSession({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true }
    }));
    
    this.use(InitSessionMiddleware);
 
    return null;
  }
}
```

Finally, you can read and write values in your controller:

```typescript
import {Session, Controller, Post} from "@tsed/common";
import {SessionModel} from "../models/SessionModel";
import {UserSession} from "../models/UserSession";
@Controller('/')
class MyCtrl {
  @Post('/')
  create(@Session() session: Express.Session) {
    session.user = new UserSession();
  }
}
```

::: tip
Example on Controller and endpoint level:
```typescript
import {Cookies, Controller, Post, UseBefore, Session} from "@tsed/common";
import {InitSessionMiddleware} from "../middlewares/InitSessionMiddleware";
import {SessionModel} from "../models/SessionModel";

@Controller('/')
@UseBefore(InitSessionMiddleware) // controller level
class MyCtrl {
  @Post('/')
  @UseBefore(InitSessionMiddleware) // or endpoint level
  create(@Session() session: SessionModel) {
    console.log(session); // SessionModel {}
  }
}
```
:::
