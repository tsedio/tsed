# Mongoose
> Fonctionnalité expérimentale. Vous pouvez contribuer pour améliorer cette fonctionnalité !

Ce tutoriel vous montre comment configurer et utiliser mongoose avec Ts.ED. 

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

### API

Ts.ED given some decorators and service to write your code:

<ul class="api-list"><li class="api-item" data-symbol="mongoose;Indexed;decorator;@;false;false;false;false"><a href="#/api/mongoose/indexed"class="symbol-container symbol-type-decorator symbol-name-mongoose-Indexed"title="Indexed"><span class="symbol decorator"></span>Indexed</a></li><li class="api-item" data-symbol="mongoose;Model;decorator;@;false;false;false;false"><a href="#/api/mongoose/model"class="symbol-container symbol-type-decorator symbol-name-mongoose-Model"title="Model"><span class="symbol decorator"></span>Model</a></li><li class="api-item" data-symbol="mongoose;Plugin;decorator;@;false;false;false;false"><a href="#/api/mongoose/plugin"class="symbol-container symbol-type-decorator symbol-name-mongoose-Plugin"title="Plugin"><span class="symbol decorator"></span>Plugin</a></li><li class="api-item" data-symbol="mongoose;Ref;decorator;@;false;false;false;false"><a href="#/api/mongoose/ref"class="symbol-container symbol-type-decorator symbol-name-mongoose-Ref"title="Ref"><span class="symbol decorator"></span>Ref</a></li><li class="api-item" data-symbol="mongoose;Schema;decorator;@;false;false;false;false"><a href="#/api/mongoose/schema"class="symbol-container symbol-type-decorator symbol-name-mongoose-Schema"title="Schema"><span class="symbol decorator"></span>Schema</a></li><li class="api-item" data-symbol="mongoose;Unique;decorator;@;false;false;false;false"><a href="#/api/mongoose/unique"class="symbol-container symbol-type-decorator symbol-name-mongoose-Unique"title="Unique"><span class="symbol decorator"></span>Unique</a></li></ul>
