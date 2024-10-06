import {EventEmitter} from "events";
import {NextFunction, Request, Response} from "express";
import {Db} from "mongodb";
import {Mongoose, Schema} from "mongoose";

import {FormioActionModelCtor} from "./FormioAction.js";
import {FormioActionsIndex} from "./FormioActionsIndex.js";
import {FormioAuth} from "./FormioAuth.js";
import {FormioBaseModel} from "./FormioBaseModel.js";
import {FormioConfig} from "./FormioConfig.js";
import {FormioHook, FormioHooks} from "./FormioHooks.js";
import {FormioModels, FormioSchemas} from "./FormioModels.js";
import {FormioTemplateUtil} from "./FormioTemplateUtil.js";
import {FormioUpdate} from "./FormioUpdate.js";
import {FormioUtil} from "./FormioUtils.js";

export interface FormioBase {
  /**
   * Auth
   */
  auth: FormioAuth;
  /**
   * Event emitter
   */
  events: EventEmitter;
  /**
   * Formio configuration
   */
  config: FormioConfig & {schema: string};

  /**
   * Emit alter `log` event. Return false to disable event logging.
   * @param event
   * @param req
   * @param info
   */
  log(event: string, req: Request, ...info: any[]): void;

  /**
   * Emit alter `audit` event if `config.audit` is enabled. Return false to disable event logging.
   * Use `console.log`.
   * @param event
   * @param req
   * @param info
   */
  audit(event: string, req: Request, ...info: any[]): void;
}

export interface FormioMiddlewares {
  alias(req: Request, res: Response, next: NextFunction): void;

  params(req: Request, res: Response, next: NextFunction): void;

  accessHandler(req: Request, res: Response, next: NextFunction): void;

  /**
   * Authorize all urls based on roles and permissions.
   * @param req
   * @param res
   * @param next
   */
  permissionHandler(req: Request, res: Response, next: NextFunction): void;

  restrictRequestTypes(req: Request, res: Response, next: NextFunction): void;
  tokenHandler(req: Request, res: Response, next: NextFunction): void;
}

export interface Formio extends FormioBase {
  Action: FormioActionModelCtor;
  BaseModel: FormioBaseModel;
  actions: FormioActionsIndex;
  resources: any;
  /**
   * Database connection
   */
  db: Db;

  schemas: FormioSchemas & {
    AccessSchema: Schema;
    PermissionSchema: Schema;
    FieldMatchAccessPermissionSchema: Schema;
  };

  models: FormioModels;
  /**
   * Mongoose lib.
   */
  mongoose: Mongoose;
  /**
   * Exported formio middlewares
   */
  readonly middleware: FormioMiddlewares;
  /**
   * Hooks.
   */
  hooks: FormioHooks;
  /**
   * Plugins.
   */
  plugins: any;
  /**
   * Formio hook util.
   */
  readonly hook: FormioHook;
  /**
   * The formio utils.
   */
  readonly util: FormioUtil;
  /**
   * Update system.
   */
  readonly update: FormioUpdate;
  /**
   * Template export/import
   */
  readonly template: FormioTemplateUtil;

  /**
   * Encryption system.
   */
  encrypt(text: string, next: (err: null | Error, hash: string) => void): void;
}
