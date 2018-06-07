# Converters

Le service Converters est responsable de la sérialisation et de la déserialisation des objets.

Il a deux modes de fonctionnement :

- Le premier utilise les [modèles de classe](fr/docs/model.md) pour 
convertir un objet en classe (et inversement). 
- Le second se base sur l'objet JSON lui-même pour fournir un objet avec les bons types. Par exemple la déserialisation des dates.

Le service Converters est utilisé par les décorateurs suivants :

<ul class="api-list"><li class="api-item" data-symbol="common/filters;BodyParams;decorator;@;false;false;false;false"><a href="#/api/common/filters/bodyparams"class="symbol-container symbol-type-decorator symbol-name-commonfilters-BodyParams"title="BodyParams"><span class="symbol decorator"></span>BodyParams</a></li><li class="api-item" data-symbol="common/filters;Cookies;decorator;@;false;false;false;false"><a href="#/api/common/filters/cookies"class="symbol-container symbol-type-decorator symbol-name-commonfilters-Cookies"title="Cookies"><span class="symbol decorator"></span>Cookies</a></li><li class="api-item" data-symbol="common/filters;CookiesParams;decorator;@;false;false;false;false"><a href="#/api/common/filters/cookiesparams"class="symbol-container symbol-type-decorator symbol-name-commonfilters-CookiesParams"title="CookiesParams"><span class="symbol decorator"></span>CookiesParams</a></li><li class="api-item" data-symbol="common/filters;PathParams;decorator;@;false;false;false;false"><a href="#/api/common/filters/pathparams"class="symbol-container symbol-type-decorator symbol-name-commonfilters-PathParams"title="PathParams"><span class="symbol decorator"></span>PathParams</a></li><li class="api-item" data-symbol="common/filters;QueryParams;decorator;@;false;false;false;false"><a href="#/api/common/filters/queryparams"class="symbol-container symbol-type-decorator symbol-name-commonfilters-QueryParams"title="QueryParams"><span class="symbol decorator"></span>QueryParams</a></li><li class="api-item" data-symbol="common/filters;Session;decorator;@;false;false;false;false"><a href="#/api/common/filters/session"class="symbol-container symbol-type-decorator symbol-name-commonfilters-Session"title="Session"><span class="symbol decorator"></span>Session</a></li></ul>

## Decorateurs

<ul class="api-list"><li class="api-item" data-symbol="common/converters;Converter;decorator;@;false;false;false;false"><a href="#/api/common/converters/converter"class="symbol-container symbol-type-decorator symbol-name-commonconverters-Converter"title="Converter"><span class="symbol decorator"></span>Converter</a></li><li class="api-item" data-symbol="common/jsonschema;IgnoreProperty;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/ignoreproperty"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-IgnoreProperty"title="IgnoreProperty"><span class="symbol decorator"></span>IgnoreProperty</a></li><li class="api-item" data-symbol="common/converters;ModelStrict;decorator;@;false;false;false;false"><a href="#/api/common/converters/modelstrict"class="symbol-container symbol-type-decorator symbol-name-commonconverters-ModelStrict"title="ModelStrict"><span class="symbol decorator"></span>ModelStrict</a></li><li class="api-item" data-symbol="common/jsonschema;PropertyName;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/propertyname"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-PropertyName"title="PropertyName"><span class="symbol decorator"></span>PropertyName</a></li><li class="api-item" data-symbol="common/jsonschema;PropertyType;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/propertytype"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-PropertyType"title="PropertyType"><span class="symbol decorator"></span>PropertyType</a></li><li class="api-item" data-symbol="common/mvc;Required;decorator;@;false;false;false;false"><a href="#/api/common/mvc/required"class="symbol-container symbol-type-decorator symbol-name-commonmvc-Required"title="Required"><span class="symbol decorator"></span>Required</a></li></ul>

## Usage

Les modèles peuvent être utilisés au niveau des controlleurs. 
Voici notre modèle:

```typescript
import  {Property, Minimum, PropertyType} from "@tsed/common";
import  {Description} from "@tsed/swagger";

class Person {
    @Property()
    firstName: string;
    
    @Property()
    lastName: string;
    
    @Description("Age in years")
    @Minimum(0)
    age: number;
    
    @PropertyType(String)
    skills: Array<string>;
}
```

> Note: `@PropertyType` permet de spécifier le type de la collection.

Et son utilisation dans un controlleur:

```typescript
import {Post, Controller, BodyParams} from "@tsed/common";
import {Person} from "../models/Person";

@Controller("/")
export class PersonsCtrl {

     @Post("/")
     save(@BodyParams() person: Person): Person {
          console.log(person instanceof Person); // true
          return person; // will be serialized according to your annotation on Person class.
     } 

     //OR
     @Post("/")
     save(@BodyParams('person') person: Person): Person {
          console.log(person instanceof Person); // true
          return person; // will be serialized according to your annotation on Person class.
     }
}
```
> Dans cet exemple, le modèle Person est utilisé à la fois en type d'entrée et de sortie.

## Sérialisation

Lorsque vous utilisez un modèle de classe en paramètre de retour, le service Converters utilisera le Schema JSON
de la classe pour sérialiser l'objet.

Voici un exemple de modèle dont certains champs ne sont volontairement pas annotés :
```typescript
class User {
    _id: string;
    
    @Property()
    firstName: string;
    
    @Property()
    lastName: string;
    
    password: string;
}
```

Et notre controlleur :

```typescript
import {Post, Controller, BodyParams} from "@tsed/common";
import {Person} from "../models/Person";

@Controller("/")
export class UsersCtrl {

    @Get("/")
    get(): User {
        const user = new User();
        user._id = "12345";
        user.firstName = "John";
        user.lastName = "Doe";
        user.password = "secretpassword";
          return 
    }
}
```

Notre objet `User` sérialisé sera le suivant:

```json
{
  "firstName": "John",
  "lastName": "Doe"
}
```
> Les champs non annoté ne seront pas recopié dans l'objet final.

Vous pouvez aussi explicitement indiqué au service Converters que le champ ne doit pas être sérialisé avec le decorateur
`@IgnoreProperty`.

```typescript
class User {
    @NotSerialize()
    _id: string;
    
    @Property()
    firstName: string;
    
    @Property()
    lastName: string;
    
    @IgnoreProperty()
    password: string;
}
```

## Les convertisseurs de type

Le service Converters repose sur ensemble de sous-service pour convertir les types suivants:

- Les basiques: [String, Number et Boolean](https://github.com/Romakita/ts-express-decorators/blob/master/src/common/converters/components/PrimitiveConverter.ts),
- Les objects: [Date](https://github.com/Romakita/ts-express-decorators/blob/master/src/common/converters/components/DateConverter.ts) et [Symbol](https://github.com/Romakita/ts-express-decorators/blob/master/src/common/converters/components/SymbolConverter.ts),
- Les collections: [Array](https://github.com/Romakita/ts-express-decorators/blob/master/src/common/converters/components/ArrayConverter.ts), [Map](https://github.com/Romakita/ts-express-decorators/blob/master/src/common/converters/components/MapConverter.ts) et [Set](https://github.com/Romakita/ts-express-decorators/blob/master/src/common/converters/components/SetConverter.ts).

> Les types Set et Map seront converties en objet JSON (et non en Array).

<ul class="api-list"><li class="api-item" data-symbol="common/converters;ArrayConverter;class;C;false;false;false;true"><a href="#/api/common/converters/arrayconverter"class="symbol-container symbol-type-class symbol-name-commonconverters-ArrayConverter"title="ArrayConverter"><span class="symbol class"></span>ArrayConverter</a></li><li class="api-item" data-symbol="common/converters;DateConverter;class;C;false;false;false;true"><a href="#/api/common/converters/dateconverter"class="symbol-container symbol-type-class symbol-name-commonconverters-DateConverter"title="DateConverter"><span class="symbol class"></span>DateConverter</a></li><li class="api-item" data-symbol="common/converters;MapConverter;class;C;false;false;false;true"><a href="#/api/common/converters/mapconverter"class="symbol-container symbol-type-class symbol-name-commonconverters-MapConverter"title="MapConverter"><span class="symbol class"></span>MapConverter</a></li><li class="api-item" data-symbol="common/converters;PrimitiveConverter;class;C;false;false;false;true"><a href="#/api/common/converters/primitiveconverter"class="symbol-container symbol-type-class symbol-name-commonconverters-PrimitiveConverter"title="PrimitiveConverter"><span class="symbol class"></span>PrimitiveConverter</a></li><li class="api-item" data-symbol="common/converters;SetConverter;class;C;false;false;false;true"><a href="#/api/common/converters/setconverter"class="symbol-container symbol-type-class symbol-name-commonconverters-SetConverter"title="SetConverter"><span class="symbol class"></span>SetConverter</a></li><li class="api-item" data-symbol="common/converters;SymbolConverter;class;C;false;false;false;true"><a href="#/api/common/converters/symbolconverter"class="symbol-container symbol-type-class symbol-name-commonconverters-SymbolConverter"title="SymbolConverter"><span class="symbol class"></span>SymbolConverter</a></li></ul>

### Exemple

Voici un exemple de convertisseur de type:

```typescript
import {IConverter, Converter} from "@tsed/common";

@Converter(String, Number, Boolean)
export class PrimitiveConverter implements IConverter {

    deserialize(data: string, target: any): String | Number | Boolean | void {

        switch (target) {
            case String:
                return "" + data;

            case Number:
                const n = +data;
                return n;

            case Boolean:

                if (data === "true") return true;
                if (data === "false") return false;

                return !!data;
        }

    }

    serialize(object: String | Number | Boolean): any {
        return object;
    }
}
```

### Créer un convertisseur de type

Ts.ED permet de créer ses propres convertisseur de la même façon que l'exemple précédent.

Pour commencer, il faut ajouter à votre configuration le répertoire où sont stockées
vos classes dédiées à convertion des types. 
 
```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import Path = require("path");
const rootDir = Path.resolve(__dirname);

@ServerSettings({
   componentsScan: [
       `${rootDir}/converters/**/**.js`
   ]
})
export class Server extends ServerLoader {
   
}       
```

Ensuite il vous faudra déclarer votre classe avec l'annotation `@Converter`:

```typescript
import {ConverterService, Converter, IConverter, IDeserializer, ISerializer} from "@tsed/common";

@Converter(Array)
export class ArrayConverter implements IConverter {

    deserialize<T>(data: any[], target: any, baseType: T, deserializer: IDeserializer): T[] {
         
        if (isArrayOrArrayClass(data)) {
            return (data as Array<any>).map(item =>
                deserializer(item, baseType)
            );
        }

        return [data];
    }

    serialize(data: any[], serializer: ISerializer) {
        return (data as Array<any>).map(item =>
            serializer(item)
        );
    }
}
```

?> Notez que cette exemple va remplacer le convertisseur par défaut de Ts.ED. 

Il est donc tout à fait possible de remplacer tous les convertisseurs de base par vos propres classes (notamment celui de la Date).


## Validation

Le service Converter assure une partie de la validation d'un modèle de classe.
Il va vérifier la cohérence de l'objet JSON avec le modèle de données. Par exemple :

  - Si l'objet JSON contient un champ de plus que ce qui est prévu dans la modèle (`validationModelStrict` ou `@ModelStrict`).
  - Si le champ est requis `@Required`,
  - Si un champ est requis mais peut-être `null` (`@Allow(null)`).

Voici un exemple complet de modèle:

```typescript
class EventModel {
    @Required()
    name: string;
     
    @PropertyName('startDate')
    startDate: Date;

    @Property({name: 'end-date'})
    endDate: Date;

    @PropertyType(TaskModel)
    @Required()
    @Allow(null)
    tasks: TaskModel[];
}

class TaskModel {
    @Required()
    subject: string;
    
    @Property()
    rate: number;
}
```

### validationModelStrict

La validation `strict` d'un objet peut être modifié soit de façon global, soit pour un modèle précis.

Voici un exemple de validation `strict`:

```typescript
import {InjectorService, ConvertersService, Required, Property} from "@tsed/common";

const injector = new InjectorService();

injector.load();

class TaskModel {
    @Required()
    subject: string;
    
    @Property()
    rate: number;
}

const convertersService = injector.get(ConvertersService);
convertersService.validationModelStrict = true;

convertersService.deserialize({unknowProperty: "test"}, TaskModel); // BadRequest
```

#### Global

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";

@ServerSettings({
   validationModelStrict: true | false
})
export class Server extends ServerLoader {
   
}      
```
> Par défaut, le service Converters est configurer sur le mode `strict`.

#### ModelStrict

```typescript
import {ConvertersService, ModelStrict, Required, Property} from "@tsed/common";

@ModelStrict(false)
class TaskModel {
   @Required()
   subject: string;
   
   @Property()
   rate: number;
   [key: string]: any; // recommended
}
````

Dans ce case précis, le service ne lèvera plus d'exception:

```typescript
import {InjectorService, ConvertersService, ModelStrict, Required, Property} from "@tsed/common";

const injector = new InjectorService();
injector.load();

const convertersService = injector.get(ConvertersService);
convertersService.validationModelStrict = true;

const result = convertersService.deserialize({unknowProperty: "test"}, TaskModel);
console.log(result) // TaskModel {unknowProperty: "test"}
```

?> Si vous avez désactivé la validation `strict` au niveau globale, il est possible d'utiliser le décorateur `@ModelStrict(true)`
pour activer la validation pour un modèle spécifique.


<div class="guide-links">
<a href="#/docs/model">Modèle</a>
<a href="#/docs/middlewares/overview">Middlewares</a>
</div>