import type {FormioComponent, FormioForm} from "@tsed/formio-types";
import type {JsonSchemaOptions} from "@tsed/schema";

export type FormioDataResolverCtx = {component: FormioComponent; form: FormioForm} & JsonSchemaOptions;
export type FormioDataResolver = (ctx: FormioDataResolverCtx) => Promise<any> | any;
