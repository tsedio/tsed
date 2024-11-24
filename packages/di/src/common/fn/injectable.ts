import {ControllerProvider} from "../domain/ControllerProvider.js";
import type {Provider} from "../domain/Provider.js";
import {ProviderType} from "../domain/ProviderType.js";
import {providerBuilder} from "../utils/providerBuilder.js";

type PickedProps = "scope" | "path" | "alias" | "hooks" | "deps" | "imports" | "configuration" | "priority";

const Props = ["type", "scope", "path", "alias", "hooks", "deps", "imports", "configuration", "priority"];
export const injectable = providerBuilder<Provider, PickedProps | "type">(Props);
export const interceptor = providerBuilder<Provider, PickedProps | "type">(Props, {
  type: ProviderType.INTERCEPTOR
});
export const controller = providerBuilder<ControllerProvider, PickedProps | "children" | "middlewares">([...Props, "middlewares"], {
  type: ProviderType.CONTROLLER
});
