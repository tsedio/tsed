# Mongoose
> Experimental feature. You can contribute to improve this feature !

<div align="center">
<a href="http://mongoosejs.com/">
<img src="http://mongodb-tools.com/img/mongoose.png" height="128">
</a>
</div>

This tutorials show you, how you can use mongoose package with Ts.ED. 

## Feature

Currently, `@tsed/mongoose` allows you:
 
- Configure one or more MongoDB database connections via the `@ServerSettings` configuration. 
All databases will be initialized when the server starts during the server's `OnInit` phase.
- Declare a Model from a class with annotation,
- Add a plugin, PreHook method and PostHook on your model.
- Inject a Model to a Service, Controller, Middleware, etc...

?> Note: `@tsed/mongoose` use the JsonSchema and his decorators to generate the mongoose schema.

## Installation

Before using the `@tsed/mongoose` package, we need to install the [mongoose](https://www.npmjs.com/package/mongoose) module.

```bash
npm install --save mongoose
npm install --save @tsed/mongoose
```

Then import `@tsed/mongoose` in your [ServerLoader](api/common/server/serverloader.md):

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

## API

Ts.ED give some decorators and service to write your code:

<ul class="api-list"><li class="api-item" data-symbol="mongoose;Indexed;decorator;@;false;false;false;false"><a href="#/api/mongoose/indexed"class="symbol-container symbol-type-decorator symbol-name-mongoose-Indexed"title="Indexed"><span class="symbol decorator"></span>Indexed</a></li><li class="api-item" data-symbol="mongoose;Model;decorator;@;false;false;false;false"><a href="#/api/mongoose/model"class="symbol-container symbol-type-decorator symbol-name-mongoose-Model"title="Model"><span class="symbol decorator"></span>Model</a></li><li class="api-item" data-symbol="mongoose;MongooseIndex;decorator;@;false;false;false;false"><a href="#/api/mongoose/mongooseindex"class="symbol-container symbol-type-decorator symbol-name-mongoose-MongooseIndex"title="MongooseIndex"><span class="symbol decorator"></span>MongooseIndex</a></li><li class="api-item" data-symbol="mongoose;MongoosePlugin;decorator;@;false;false;false;false"><a href="#/api/mongoose/mongooseplugin"class="symbol-container symbol-type-decorator symbol-name-mongoose-MongoosePlugin"title="MongoosePlugin"><span class="symbol decorator"></span>MongoosePlugin</a></li><li class="api-item" data-symbol="mongoose;PostHook;decorator;@;false;false;false;false"><a href="#/api/mongoose/posthook"class="symbol-container symbol-type-decorator symbol-name-mongoose-PostHook"title="PostHook"><span class="symbol decorator"></span>PostHook</a></li><li class="api-item" data-symbol="mongoose;Ref;decorator;@;false;false;false;false"><a href="#/api/mongoose/ref"class="symbol-container symbol-type-decorator symbol-name-mongoose-Ref"title="Ref"><span class="symbol decorator"></span>Ref</a></li><li class="api-item" data-symbol="mongoose;Schema;decorator;@;false;false;false;false"><a href="#/api/mongoose/schema"class="symbol-container symbol-type-decorator symbol-name-mongoose-Schema"title="Schema"><span class="symbol decorator"></span>Schema</a></li><li class="api-item" data-symbol="mongoose;Select;decorator;@;false;false;false;false"><a href="#/api/mongoose/select"class="symbol-container symbol-type-decorator symbol-name-mongoose-Select"title="Select"><span class="symbol decorator"></span>Select</a></li><li class="api-item" data-symbol="mongoose;Unique;decorator;@;false;false;false;false"><a href="#/api/mongoose/unique"class="symbol-container symbol-type-decorator symbol-name-mongoose-Unique"title="Unique"><span class="symbol decorator"></span>Unique</a></li></ul>


## Declaring a Model

By default, `@tsed/mongoose` reuse the metadata stored by the decorators dedicated
to describe a JsonSchema. These decorators come from the `@tsed/common` package.


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

It's possible to inject a model into a Service (or Controller, Middleware, etc...):

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

Using the `@Plugin` decorator enables the developer to attach various Mongoose plugins to the schema. 
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
!> You can find the [Mongoose & Swagger](https://github.com/Romakita/example-ts-express-decorator/tree/4.0.0/example-mongoose) example project.


<div class="guide-links">
<a href="#/tutorials/typeorm">TypeORM</a>
<a href="#/tutorials/swagger">Swagger</a>
</div>