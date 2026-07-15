import {DecoratorTypes} from "@tsed/core";

import {JsonClassStore} from "./JsonClassStore.js";
import {JsonEntitiesContainer} from "./JsonEntitiesContainer.js";
import {JsonMethodStore} from "./JsonMethodStore.js";
import {JsonParameterStore} from "./JsonParameterStore.js";
import {JsonPropertyStore} from "./JsonPropertyStore.js";

JsonEntitiesContainer.set(DecoratorTypes.CLASS, JsonClassStore);
JsonEntitiesContainer.set(DecoratorTypes.PROP, JsonPropertyStore);
JsonEntitiesContainer.set(DecoratorTypes.PARAM, JsonParameterStore);
JsonEntitiesContainer.set(DecoratorTypes.METHOD, JsonMethodStore);
