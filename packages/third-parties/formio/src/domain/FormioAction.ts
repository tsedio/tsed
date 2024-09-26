import type {FormioAction, FormioActionInfo} from "@tsed/formio-types";
import type {Request, Response} from "express";

import type {FormioMongooseSchema} from "./FormioBaseModel.js";
import type {FormioComponent} from "./FormioModels.js";

export interface FormioActionModel extends FormioAction {
  resolve(handler: string, method: string, req: Request, res: Response, next: Function, setActionItemMessage: SetActionItemMessage): void;
}

export type FormioActionMongooseSchema = FormioMongooseSchema<FormioAction>;
export type SetActionItemMessage = (message: string, data?: any, state?: any) => void;

export interface FormioActionModelCtor {
  schema?: FormioActionMongooseSchema;

  info(req: Request, response: Response, next: (err: any, info: FormioActionInfo) => void): void;

  settingsForm(req: Request, response: Response, next: (err: any, info: FormioComponent[]) => void): void;

  new (data: FormioAction, req: Request, res: Response): FormioActionModel;
}

export interface ActionMethods {
  info?(req: Request, response: Response): Promise<FormioAction>;

  settingsForm(req: Request, response: Response): Promise<FormioComponent[]>;

  resolve(...args: any[]): Promise<any>;
}
