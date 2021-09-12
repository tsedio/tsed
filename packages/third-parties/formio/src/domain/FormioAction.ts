import {Request, Response} from "express";
import {FormioMongooseSchema} from "./FormioBaseModel";
import {FormioComponent} from "./FormioModels";

export interface FormioActionInfo {
  name: string;
  title: string;
  description: string;
  priority: number;
  defaults: {
    handler: string[];
    method: string[];
  };
  access?: {
    handler: boolean;
    method: boolean;
  };
}

export interface FormioAction<Settings = any> {
  name: string;
  title: string;
  action: string;
  handler: string[];
  method: string[];
  priority: number;
  form: any;
  settings: Settings;
  condition?: any;
  deleted?: number | null;
}

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
