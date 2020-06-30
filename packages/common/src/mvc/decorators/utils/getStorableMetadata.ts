import {PropertyMetadata} from "@tsed/common";
import {DecoratorParameters, getDecoratorType, Storable} from "@tsed/core";
import {ParamMetadata} from "../../models/ParamMetadata";

export function getStorableMetadata(decoratorArgs: DecoratorParameters): Storable | undefined {
  switch (getDecoratorType(decoratorArgs, true)) {
    case "parameter":
      return ParamMetadata.get(decoratorArgs[0], decoratorArgs[1], decoratorArgs[2] as number);
    case "property":
      return PropertyMetadata.get(decoratorArgs[0], decoratorArgs[1]);
  }
}
