# @tsed/platform-gcp

[![Build & Release](https://github.com/tsedio/tsed/workflows/Build%20&%20Release/badge.svg)](https://github.com/tsedio/tsed/actions?query=workflow%3A%22Build+%26+Release%22)
[![Coverage Status](https://coveralls.io/repos/github/tsedio/tsed/badge.svg?branch=production)](https://coveralls.io/github/tsedio/tsed?branch=production)

> Platform Google Cloud Functions module for Ts.ED Framework

## Features

- Google Cloud Functions support for Ts.ED
- Support for HTTP and background functions
- Express-like API for handling requests and responses
- Dependency injection and all Ts.ED features

## Installation

```bash
npm install --save @tsed/platform-gcp
```

## Usage

### HTTP Functions

```typescript
import {Controller} from "@tsed/di";
import {GCPFunction} from "@tsed/platform-gcp";
import {Get, Post, Returns} from "@tsed/schema";

@Controller("/users")
export class UsersController {
  @Get("/:id")
  @GCPFunction()
  @Returns(200, User)
  async getUser(@PathParams("id") id: string): Promise<User> {
    return new User({id, name: "John Doe"});
  }

  @Post("/")
  @GCPFunction()
  @Returns(201, User)
  async createUser(@BodyParams() payload: CreateUserDto): Promise<User> {
    const user = new User({...payload, id: "new-id"});
    return user;
  }
}
```

### Background Functions

```typescript
import {Controller} from "@tsed/di";
import {GCPFunction} from "@tsed/platform-gcp";

@Controller("/")
export class BackgroundController {
  @GCPFunction()
  async processEvent(@BodyParams() data: any, @Context() context: any): Promise<void> {
    console.log("Processing event:", data);
    console.log("Event context:", context);
    // Process the event
  }
}
```

### Creating a Google Cloud Function

```typescript
import {PlatformGCP} from "@tsed/platform-gcp";
import {UsersController} from "./controllers/UsersController";

// For HTTP functions
export const getUser = PlatformGCP.callback(UsersController, "getUser");
export const createUser = PlatformGCP.callback(UsersController, "createUser");

// For background functions
export const processEvent = PlatformGCP.callback(BackgroundController, "processEvent");
```

## Documentation

Visit [https://tsed.dev](https://tsed.dev) for more details.

## Contributors

Please read [contributing guidelines here](https://tsed.dev/contributing.html).

<a href="https://github.com/tsedio/tsed/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/tiers/backer.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your
website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2023 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
