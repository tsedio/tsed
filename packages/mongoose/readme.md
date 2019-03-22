# @tsed/mongoose

> Experimental feature. You can contribute to improve this feature !

<div align="center">
<a href="http://mongoosejs.com/">
<img src="http://mongodb-tools.com/img/mongoose.png" height="128">
</a>
</div>

A package of Ts.ED framework. See website: https://tsed.io/#/tutorials/mongoose

## Feature

Currently, `@tsed/mongoose` allows you:
 
- Configure one or more MongoDB database connections via the `@ServerSettings` configuration. 
All databases will be initialized when the server starts during the server's `OnInit` phase.
- Declare a Model from a class with annotation,
- Add a plugin, PreHook method and PostHook on your model.
- Inject a Model to a Service, Controller, Middleware, etc...

> Note: `@tsed/mongoose` use the JsonSchema and his decorators to generate the mongoose schema.

## Installation

Before using the `@tsed/mongoose` package, we need to install the [mongoose](https://www.npmjs.com/package/mongoose) module.

```bash
npm install --save mongoose
npm install --save @tsed/mongoose
```

Then import `@tsed/mongoose` in your [ServerLoader](https://tsed.io/api/common/server/components/ServerLoader.html):

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/mongoose"; // import mongoose ts.ed module

@ServerSettings({
   mongoose: {
       url: "mongodb://127.0.0.1:27017/db1",
       connectionOptions: {
           
       }
   }
})
export class Server extends ServerLoader {

}
```

## Multi databases

The mongoose module of Ts.ED Mongoose allows to configure several basic connections to MongoDB.
Here is an example configuration:

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/mongoose"; // import mongoose ts.ed module

@ServerSettings({
    mongoose: {
       urls: {
           db1: {
               url: "mongodb://127.0.0.1:27017/db1",
               connectionOptions: {
                   
               }
           },
           db2: {
              url: "mongodb://127.0.0.1:27017/db2",
              connectionOptions: {
                  
              }
           }
       }
    }
})
export class Server extends ServerLoader {

}
```

## MongooseService

MongooseService let you to retrieve an instance of Mongoose.Connection. 

```typescript
import {Service} from "@tsed/common";
import {MongooseService} from "@tsed/mongoose";

@Service()
export class MyService {
    
    constructor(mongooseService: MongooseService) {
        mongooseService.get(); // return the default instance of Mongoose.
        // If you have one or more database configured with Ts.ED
        mongooseService.get("db1");
        mongooseService.get("db2");
    }
}
```

## Declaring a Model

By default, Ts.ED mongoose will reuse the metadata stored by the decorators dedicated
to describe a JsonSchema. This decorators come from the `@tsed/common` package.


Here a model example:

```typescript
import {
    Minimum, Maximum, MaxLength, MinLength, 
    Enum, Pattern, IgnoreProperty, Required, 
    PropertyType
} from "@tsed/common";
import {Model, Unique, Indexed, Ref} from "@tsed/mongoose"

enum Categories {
    CAT1 = "cat1",
    CAT2 = "cat2"
}

@Model()
export class MyModel {
    
    @IgnoreProperty() // exclude _id from mongoose in the generated schema
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
    
    @PropertyType(String)
    arrayOf: string[];
    
    @Ref(OtherModel)
    ref: Ref<OtherModel>;
    
    @Ref(OtherModel)
    refs: Ref<OtherModel>[];
}
```

## Inject model

```typescript
import {Service, Inject} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {MyModel} from "./models/MyModel";

@Service()
export class MyService {
    
    constructor(@Inject(MyModel) private model: MongooseModel<MyModel>): MyModel {
        console.log(model) // Mongoose.model class
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
import {IgnoreProperty, Required} from "@tsed/common";
import {PreHook, Model} from "@tsed/mongoose";

@Model()
@PreHook("save", (car: CarModel, next) => {
    if (car.model === 'Tesla') {
        car.isFast = true;
      }
      next();
})
export class CarModel {
    
    @IgnoreProperty()
    _id: string;
    
    @Required()
    model: string;
    
    @Required()
    isFast: boolean;
    
    // or Prehook on static method
    @PreHook("save")
    static preSave(car: CarModel, next) {
       if (car.model === 'Tesla') {
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
import {IgnoreProperty, Required} from "@tsed/common";
import {PostHook, Model} from "@tsed/mongoose";

@Model()
@PostHook("save", (car: CarModel) => {
    if (car.topSpeedInKmH > 300) {
        console.log(car.model, 'is fast!');
    }
})
export class CarModel {
    
    @IgnoreProperty()
    _id: string;
    
    @Required()
    model: string;
    
    @Required()
    isFast: boolean;
    
    // or Prehook on static method
    @PostHook("save")
    static postSave(car: CarModel) {
       if (car.topSpeedInKmH > 300) {
           console.log(car.model, 'is fast!');
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
import {IgnoreProperty, Required} from "@tsed/common";
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

## Contributors
Please read [contributing guidelines here](https://tsed.io/CONTRIBUTING.html)

<a href="https://github.com/TypedProject/ts-express-decorators/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2018 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
