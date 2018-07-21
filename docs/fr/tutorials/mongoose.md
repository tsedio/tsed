# Mongoose
> Fonctionnalité expérimentale. Vous pouvez contribuer pour améliorer cette fonctionnalité !

<div align="center">
<a href="http://mongoosejs.com/">
<img src="http://mongodb-tools.com/img/mongoose.png" height="128">
</a>
</div>

Ce tutoriel vous montre comment configurer et utiliser mongoose avec Ts.ED.

## Feature

Actuellement, `@tsed/mongoose` permet de configurer une ou plusieurs connexion de base de données MongoDB via 
la configuration `@ServerSettings`.

L'ensemble des bases de données seront initialisées au démarrage du serveur lors de la phase `OnInit` du serveur.

## Installation

Avant d'utiliser le module `@tsed/mongoose`, nous avons besoin d'installer le module [mongoose](https://www.npmjs.com/package/mongoose).

```bash
npm install --save mongoose
npm install --save @tsed/mongoose
```

Ensuite, nous devons importer `@tsed/mongoose` au niveau de notre [ServerLoader](api/common/server/serverloader.md):

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

## Mutilple base données

Le module mongoose de Ts.ED mongoose permet de configurer plusieurs connexion de base de données à MongoDB. 
Voici un exemple de configuration :

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

MongooseService vous permet de récuperer une instance Mongoose.Connection.

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

### API

Ts.ED fournit les decorateurs et services suivant:

<ul class="api-list"><li class="api-item" data-symbol="mongoose;Indexed;decorator;@;false;false;false;false"><a href="#/api/mongoose/indexed"class="symbol-container symbol-type-decorator symbol-name-mongoose-Indexed"title="Indexed"><span class="symbol decorator"></span>Indexed</a></li><li class="api-item" data-symbol="mongoose;Model;decorator;@;false;false;false;false"><a href="#/api/mongoose/model"class="symbol-container symbol-type-decorator symbol-name-mongoose-Model"title="Model"><span class="symbol decorator"></span>Model</a></li><li class="api-item" data-symbol="mongoose;MongooseIndex;decorator;@;false;false;false;false"><a href="#/api/mongoose/mongooseindex"class="symbol-container symbol-type-decorator symbol-name-mongoose-MongooseIndex"title="MongooseIndex"><span class="symbol decorator"></span>MongooseIndex</a></li><li class="api-item" data-symbol="mongoose;MongoosePlugin;decorator;@;false;false;false;false"><a href="#/api/mongoose/mongooseplugin"class="symbol-container symbol-type-decorator symbol-name-mongoose-MongoosePlugin"title="MongoosePlugin"><span class="symbol decorator"></span>MongoosePlugin</a></li><li class="api-item" data-symbol="mongoose;PostHook;decorator;@;false;false;false;false"><a href="#/api/mongoose/posthook"class="symbol-container symbol-type-decorator symbol-name-mongoose-PostHook"title="PostHook"><span class="symbol decorator"></span>PostHook</a></li><li class="api-item" data-symbol="mongoose;Ref;decorator;@;false;false;false;false"><a href="#/api/mongoose/ref"class="symbol-container symbol-type-decorator symbol-name-mongoose-Ref"title="Ref"><span class="symbol decorator"></span>Ref</a></li><li class="api-item" data-symbol="mongoose;Schema;decorator;@;false;false;false;false"><a href="#/api/mongoose/schema"class="symbol-container symbol-type-decorator symbol-name-mongoose-Schema"title="Schema"><span class="symbol decorator"></span>Schema</a></li><li class="api-item" data-symbol="mongoose;Select;decorator;@;false;false;false;false"><a href="#/api/mongoose/select"class="symbol-container symbol-type-decorator symbol-name-mongoose-Select"title="Select"><span class="symbol decorator"></span>Select</a></li><li class="api-item" data-symbol="mongoose;Unique;decorator;@;false;false;false;false"><a href="#/api/mongoose/unique"class="symbol-container symbol-type-decorator symbol-name-mongoose-Unique"title="Unique"><span class="symbol decorator"></span>Unique</a></li></ul>


## Declaring a Model

Par défaut, Ts.ED réutilise les métadonnées sockées par les decorateurs dédiés 
à la description de schema JSON. Ces decorateurs proviennent du package `@tsed/common`.

Voici un exemple de modèle:

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

Il est possible d'injecter le modèle mongoose dans un Service (ou Controlleur, Middleware, etc...) de la façon suivante :

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

Mongoose permet au développeur d'ajouter des [hooks] (http://mongoosejs.com/docs/middleware.html) au schéma (pre et post).
Avec ceci, il est possible d'ajouter des transformations de document et des observations avant ou après la validation, l'enregistrement et plus encore.

Ts.ED fournit un décorateur de classe pour enregistrer les middlewares sur les hooks pre et post.

### Pre hook

Il est possible d'attacher un décorateur `@PreHook` à notre modèle de classe et
ensuite de définir une fonction comme le feriez en temps normal avec Mongoose. 

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

Le hook `pre-save` sera éxecuter à chaque fois qu'un document `CarModel` est sauvegardé.


### Post hook

Il est possible d'attacher un décorateur `@PostHook` à notre modèle de classe et
ensuite de définir une fonction comme le feriez en temps normal avec Mongoose. 

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

Le hook `post-save` sera éxecuter à chaque fois qu'un document `CarModel` est sauvegardé.

## Plugin

L'utilisation du décorateur `@Plugin` permet au développeur d'attacher plusieurs plugins Mongoose au schéma.
Tout comme l'appel `schema.plugin()`, le décorateur accepte 1 ou 2 paramètres: le plugin lui-même et un objet de configuration optionnel.
Plusieurs décorateurs "plugin" peuvent être utilisés pour une seule classe de modèle.

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

!> Vous pouvez récupérer le projet exemple [Mongoose & Swagger](https://github.com/Romakita/example-ts-express-decorator/tree/4.0.0/example-mongoose)


<div class="guide-links">
<a href="#/tutorials/socket-io">Socket.io</a>
<a href="#/tutorials/swagger">Swagger</a>
</div>