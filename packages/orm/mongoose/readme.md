<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>Mongoose</h1>

[![Build & Release](https://github.com/tsedio/tsed/workflows/Build%20&%20Release/badge.svg)](https://github.com/tsedio/tsed/actions?query=workflow%3A%22Build+%26+Release%22)
[![PR Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/tsedio/tsed/blob/master/CONTRIBUTING.md)
[![npm version](https://badge.fury.io/js/%40tsed%2Fcommon.svg)](https://badge.fury.io/js/%40tsed%2Fcommon)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![github](https://img.shields.io/static/v1?label=Github%20sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/romakita)
[![opencollective](https://img.shields.io/static/v1?label=OpenCollective%20sponsor&message=%E2%9D%A4&logo=OpenCollective&color=%23fe8e86)](https://opencollective.com/tsed)

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

A package of Ts.ED framework. See website: https://tsed.io/tutorials/mongoose.html

## Features

Currently, `@tsed/mongoose` allows you:

- Configure one or more MongoDB database connections via the `@Configuration` configuration.
  All databases will be initialized when the server starts during the server's `OnInit` phase.
- Declare a Model from a class with annotation.
- Declare inherited models in a single collection via `@DiscriminatorKey`.
- Add a plugin, PreHook method and PostHook on your model.
- Inject a Model to a Service, Controller, Middleware, etc...

> Note: `@tsed/mongoose` use the JsonSchema and his decorators to generate the mongoose schema.

## Installation

Before using the `@tsed/mongoose` package, we need to install the [mongoose](https://www.npmjs.com/package/mongoose) module.

```bash
npm install --save mongoose
npm install --save @tsed/mongoose
npm install --save-dev @types/mongoose
```

Then import `@tsed/mongoose` in your Server:

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/mongoose"; // import mongoose ts.ed module

@Configuration({
  mongoose: [
    {
      id: "default",
      url: "mongodb://127.0.0.1:27017/db1",
      connectionOptions: {}
    }
  ]
})
export class Server {}
```

## Multi databases

The mongoose module of Ts.ED Mongoose allows to configure several basic connections to MongoDB.
Here is an example configuration:

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/mongoose"; // import mongoose ts.ed module

@Configuration({
  mongoose: [
    {
      id: "default",
      url: "mongodb://127.0.0.1:27017/db1",
      connectionOptions: {}
    },
    {
      id: "default",
      url: "mongodb://127.0.0.1:27017/db2",
      connectionOptions: {}
    }
  ]
})
export class Server {}
```

## MongooseService

MongooseService let you retrieve an instance of Mongoose.Connection.

```typescript
import {Service} from "@tsed/di";
import {MongooseService} from "@tsed/mongoose";

@Service()
export class MyService {
  constructor(mongooseService: MongooseService) {
    mongooseService.get(); // return the default instance of Mongoose.
    // If you have one or more database configured with Ts.ED
    mongooseService.get("default");
    mongooseService.get("db2");
  }
}
```

## Declaring a Model

By default, Ts.ED mongoose will reuse the metadata stored by the decorators dedicated
to describe a JsonSchema. These decorators come from the `@tsed/schema` package.

Here a model example:

```typescript
import {Minimum, Maximum, MaxLength, MinLength, Enum, Pattern, Required, CollectionOf} from "@tsed/schema";
import {Model, Unique, Indexed, Ref, ObjectID} from "@tsed/mongoose";

enum Categories {
  CAT1 = "cat1",
  CAT2 = "cat2"
}

@Model({dbName: "default"}) // dbName is optional. By default dbName is equal to default
export class MyModel {
  @ObjectID()
  _id: string;

  @Unique()
  @Required()
  unique: string;

  @Indexed()
  @MinLength(3)
  @MaxLength(50)
  indexed: string;

  @Minimum(0)
  @Maximum(100)
  rate: Number;

  @Enum(Categories)
  // or @Enum("type1", "type2")
  category: Categories;

  @Pattern(/[a-z]/) // equivalent of match field in mongoose
  pattern: String;

  @CollectionOf(String)
  arrayOf: string[];

  @Ref(OtherModel)
  ref: Ref<OtherModel>;

  @Ref(OtherModel)
  refs: Ref<OtherModel>[];
}
```

## Inject model

```typescript
import {Service, Inject} from "@tsed/di";
import {MongooseModel} from "@tsed/mongoose";
import {MyModel} from "./models/MyModel.js";

@Service()
export class MyService {
  constructor(@Inject(MyModel) private model: MongooseModel<MyModel>): MyModel {
    console.log(model); // Mongoose.model class
  }

  async save(obj: MyModel): MongooseModel<MyModel> {
    const doc = new this.model(obj);
    await doc.save();

    return doc;
  }

  async find(query: any) {
    const list = await this.model.find(query).exec();

    console.log(list);

    return list;
  }
}
```

## Register hook

Mongoose allows the developer to add pre and post [hooks / middlewares](http://mongoosejs.com/docs/middleware.html) to the schema.
With this it is possible to add document transformations and observations before or after validation, save and more.

Ts.ED provide class decorator to register middlewares on the pre and post hook.

### Pre hook

We can simply attach a `@PreHook` decorator to your model class and
define the hook function like you normally would in Mongoose.

```typescript
import {Required} from "@tsed/schema";
import {PreHook, Model, ObjectID} from "@tsed/mongoose";

@Model()
@PreHook("save", (car: CarModel, next) => {
  if (car.model === "Tesla") {
    car.isFast = true;
  }
  next();
})
export class CarModel {
  @ObjectID()
  _id: string;

  @Required()
  model: string;

  @Required()
  isFast: boolean;

  // or Prehook on static method
  @PreHook("save")
  static preSave(car: CarModel, next) {
    if (car.model === "Tesla") {
      car.isFast = true;
    }
    next();
  }
}
```

This will execute the pre-save hook each time a `CarModel` document is saved.

### Post hook

We can simply attach a `@PostHook` decorator to your model class and
define the hook function like you normally would in Mongoose.

```typescript
import {ObjectID, Required} from "@tsed/schema";
import {PostHook, Model} from "@tsed/mongoose";

@Model()
@PostHook("save", (car: CarModel) => {
  if (car.topSpeedInKmH > 300) {
    console.log(car.model, "is fast!");
  }
})
export class CarModel {
  @ObjectID()
  _id: string;

  @Required()
  model: string;

  @Required()
  isFast: boolean;

  // or Prehook on static method
  @PostHook("save")
  static postSave(car: CarModel) {
    if (car.topSpeedInKmH > 300) {
      console.log(car.model, "is fast!");
    }
  }
}
```

This will execute the post-save hook each time a `CarModel` document is saved.

## Plugin

Using the `plugin` decorator enables the developer to attach various Mongoose plugins to the schema.
Just like the regular `schema.plugin()` call, the decorator accepts 1 or 2 parameters: the plugin itself, and an optional configuration object.
Multiple `plugin` decorator can be used for a single model class.

```typescript
import {Service} from "@tsed/di";
import {MongoosePlugin, Model, MongooseModel} from "@tsed/mongoose";
import * as findOrCreate from 'mongoose-findorcreate';

@Model()
@MongoosePlugin(findOrCreate)
class UserModel {
  // this isn't the complete method signature, just an example
  static findOrCreate(condition: InstanceType<User>):
    Promise<{ doc: InstanceType<User>, created: boolean }>;
}

@Service()
class UserService {
    constructor(@Inject(UserModel) userModel: MongooseModel<UserModel>) {
        userModel.findOrCreate({ ... }).then(findOrCreateResult => {
          ...
        });
    }
}
```

## Discriminators

Set the `@DiscriminatorKey` decorator on a property in the parent class to define the name of the field for the discriminator value.

Extend the child model classes from the parent class. By default the value for the discriminator field is the class name but it can be overwritten via the `discriminatorValue` option on the model.

```typescript
@Model()
class EventModel {
  @ObjectID()
  _id: string;

  @Required()
  time: Date = new Date();

  @DiscriminatorKey()
  type: string;
}

@Model()
class ClickedLinkEventModel extends EventModel {
  @Required()
  url: string;
}

@Model({discriminatorValue: "signUpEvent"})
class SignedUpEventModel extends EventModel {
  @Required()
  user: string;
}
```

For further information, please refer to the [mongoose documentation about discriminators](https://mongoosejs.com/docs/discriminators.html).

## Contributors

Please read [contributing guidelines here](https://tsed.io/contributing.html)

<a href="https://github.com/tsedio/tsed/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/backers.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2022 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
