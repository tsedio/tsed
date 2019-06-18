import {DecoratorParameters, getDecoratorType, Storable} from "@tsed/core";
import {ParamRegistry} from "../../../filters/registries/ParamRegistry";
import {PropertyRegistry} from "../../../jsonschema/registries/PropertyRegistry";

export function getStorableMetadata(decoratorArgs: DecoratorParameters): Storable | undefined {
  switch (getDecoratorType(decoratorArgs, true)) {
    case "parameter":
      return ParamRegistry.get(decoratorArgs[0], decoratorArgs[1], decoratorArgs[2] as number);
    case "property":
      return PropertyRegistry.get(decoratorArgs[0], decoratorArgs[1]);
  }
}
