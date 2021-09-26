import {DecoratorTypes} from "@tsed/core";
import {JsonEntityComponent, JsonEntityStore} from "@tsed/schema";

/**
 * @deprecated Since 2021-09-26. Use JsonEntityStore
 */
@JsonEntityComponent(DecoratorTypes.PROP)
export class PropertyMetadata extends JsonEntityStore {}
