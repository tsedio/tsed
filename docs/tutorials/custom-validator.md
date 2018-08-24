# Custom validator

Ts.ED provide by default a [AJV](/tutorials/ajv.md) package to perform a validation on a Model. But, you can choose another library as model validator.
 
To do that, you need to create a custom validation service that will inherit from the [ValidationService](/api/common/mvc/validationservice.md)
 and override this service with the [OverrideService](/api/common/di/overrideservice.md) decorator.

### Create your service

In your project, create a new file named `CustomValidationService.ts` and create a class based on this example:

```typescript
import {BadRequest} from "ts-httpexceptions";
import {OverrideService, JsonSchemesService, ValidationService} from "@tsed/common";

@OverrideService(ValidationService)
export class CustomValidationService extends ValidationService {
    constructor(private jsonSchemaService: JsonSchemesService) {
        super();
    }

    public validate(obj: any, targetType: any, baseType?: any): void {
        // JSON service contain tool to build the Schema definition of a model.
        const schema = this.jsonSchemaService.getSchemaDefinition(targetType);

        if (schema) {
            const valid = myLibraryValidation.validate(schema, obj);

            if (!valid) {
                throw(new BadRequest(`{{name}} is wrong`));
            }
        }
    }
}
```

### Import your service

Edit your `server.ts` and import manually your `CustomValidationService`:

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import "./services/override/CustomValidationService";

@ServerSettings({
  // ...
})
export class Server extends ServerLoader {
    
}
```

> Now your custom validation service will be used when a model must be validated.
