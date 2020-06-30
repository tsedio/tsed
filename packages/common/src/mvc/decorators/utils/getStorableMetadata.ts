import {DecoratorParameters, getDecoratorType, Storable} from "@tsed/core";
import {PropertyRegistry} from "../../../jsonschema/registries/PropertyRegistry";
import {ParamMetadata} from "../../models/ParamMetadata";

export function getStorableMetadata(decoratorArgs: DecoratorParameters): Storable | undefined {
  switch (getDecoratorType(decoratorArgs, true)) {
    case "parameter":
      return ParamMetadata.get(decoratorArgs[0], decoratorArgs[1], decoratorArgs[2] as number);
    case "property":
      return PropertyRegistry.get(decoratorArgs[0], decoratorArgs[1]);
  }
}
