# @tsed/di

[![Build & Release](https://github.com/TypedProject/tsed/workflows/Build%20&%20Release/badge.svg)](https://github.com/TypedProject/tsed/actions?query=workflow%3A%22Build+%26+Release%22)
[![Coverage Status](https://coveralls.io/repos/github/TypedProject/tsed/badge.svg?branch=production)](https://coveralls.io/github/TypedProject/tsed?branch=production)

[![npm version](https://badge.fury.io/js/%40tsed%2Fcommon.svg)](https://badge.fury.io/js/%40tsed%2Fcommon)
[![Known Vulnerabilities](https://snyk.io/test/github/TypedProject/tsed/badge.svg)](https://snyk.io/test/github/TypedProject/tsed)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![backers](https://opencollective.com/tsed/tiers/badge.svg)](https://opencollective.com/tsed)

<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

A package of Ts.ED framework. See website: https://tsed.io/

# Installation

You can get the latest release and the type definitions using npm:
```bash
npm install --save @tsed/di
```

> **Important!** TsExpressDecorators requires Node >= 6, Express >= 4, TypeScript >= 2.0 and 
the `experimentalDecorators`, `emitDecoratorMetadata`, `types` and `lib` compilation 
options in your `tsconfig.json` file.

```json
{
  "compilerOptions": {
    "target": "es2016",
    "lib": ["es2016"],
    "typeRoots": [
      "./node_modules/@types"
    ],
    "module": "commonjs",
    "moduleResolution": "node",
    "experimentalDecorators":true,
    "emitDecoratorMetadata": true,
    "allowSyntheticDefaultImports": true
  },
  "exclude": [
    "node_modules"
  ]
}
```

## Introduction

Basically, almost everything may be considered as a provider – service, factory, intereceptors, and so on. 
All of them can inject dependencies, meaning, they can create various relationships with each other.
 But in fact, a provider is nothing else than just a simple class annotated with an `@Injectable()` decorator.

## Usage

Here is a basic usage to declare an injectable service to another one:

```typescript
import {Injectable} from "@tsed/di";
import {Calendar} from "./models/calendar";

@Injectable()
export class CalendarsService {
  private readonly calendars: Calendar[] = [];
  
    create(calendar: Calendar) {
      this.calendars.push(calendar);
    }
  
    findAll(): Calendar[] {
      return this.calendars;
    }
}
```

Here's a CalendarsService, a basic class with one property and two methods. The only new trait is that it uses the `@Injectable()` decorator.
The `@Injectable()` attaches the metadata, thereby Ts.ED knows that this class is a provider.
  
Now we have the service class already done, let's use it inside a controller:
```typescript
import { Controller, Post, Body, Get } from '@tsed/common';
import { CalendarsService } from './CalendarsService';
import { Calendar } from './models/Calendar';

@Controller('/calendars')
export class CalendarService {
  constructor(private readonly calendarsService: CalendarsService) {}

  @Post()
  async create(@Body() calendar: Calendar) {
    this.calendarsService.create(calendar);
  }

  @Get()
  async findAll(): Promise<Calendar[]> {
    return this.calendarsService.findAll();
  }
}
```
> Note: Controller isn't a part of `@tsed/di`. `@Controller` decorator is exposed by `@tsed/common` package because it's a specific provider
used by the Ts.ED framework. Ts.ED DI allow you to define your own Provider and decorator.


Finally, we can load the injector and use:
```typescript
import {InjectorService} from "@tsed/di";
import {CalendarCtrl} from "./CalendarCtrl";

async function bootstrap() {
  const injector = new InjectorService()
  
  // Load all providers registered via @Injectable decorator
  await injector.load()
        
  const calendarController = injector.get<CalendarCtrl>()
  
  await calendarController.create(new Calendar())
  
  // And finally destroy injector and his instances (see injector hooks)
  await injector.destroy()
}

bootstrap()
```

## Custom providers

To organize your code Ts.ED DI provide different kind of providers:

- Provider can be declared with `@Injectable`,
- Service can be declared with `@Service`,
- Interceptor can be declared with `@Interceptor`,
- Factory and Value can be declared with `registerFactory` and `registerValue`.


See more details on our documentation https://tsed.io/providers.html


## Contributors
Please read [contributing guidelines here](https://tsed.io/CONTRIBUTING.html)

<a href="https://github.com/TypedProject/ts-express-decorators/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/tiers/backer.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2018 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
