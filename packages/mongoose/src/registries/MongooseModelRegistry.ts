import {GlobalProviders, Provider, TypedProvidersRegistry} from "@tsed/di";

export const PROVIDER_TYPE_MONGOOSE_MODEL = "mongooseModel";
// tslint:disable-next-line: variable-name
export const MongooseModelRegistry: TypedProvidersRegistry = GlobalProviders.createRegistry(PROVIDER_TYPE_MONGOOSE_MODEL, Provider, {
  injectable: true
});

export const registerModel = GlobalProviders.createRegisterFn(PROVIDER_TYPE_MONGOOSE_MODEL);
