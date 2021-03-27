import {Inject, Injectable, InjectorService} from "@tsed/common";
import {MongooseConnectionOptions} from "@tsed/mongoose";
import {Db} from "mongodb";
import {Mongoose} from "mongoose";
import {promisify} from "util";
import {Formio} from "../domain/Formio";
import {FormioConfig} from "../domain/FormioConfig";
import {FormioHook} from "../domain/FormioHooks";
import {FormioSchemas} from "../domain/FormioModels";
import {FormioRouter} from "../domain/FormioRouter";
import {FormioTemplate} from "../domain/FormioTemplate";
import {FormioExportOptions} from "../domain/FormioTemplateUtil";
import {FormioHooksService} from "./FormioHooksService";

const createRouter = require("formio");
const swagger = require("formio/src/util/swagger.js");
const util = require("formio/src/util/util.js");

@Injectable()
export class FormioService {
  router: FormioRouter;

  @Inject()
  protected injector: InjectorService;

  @Inject()
  protected hooksService: FormioHooksService;

  // istanbul ignore next
  get swagger() {
    return (...args: any[]) => new Promise((resolve) => swagger(...args, resolve));
  }

  get config(): FormioConfig {
    return this.formio.config;
  }

  get db(): Db {
    return this.formio.db;
  }

  get resources() {
    return this.formio.resources;
  }

  get mongoose(): Mongoose {
    return this.formio.mongoose;
  }

  get middleware() {
    return this.formio.middleware;
  }

  get schemas(): FormioSchemas {
    return this.formio.schemas;
  }

  get formio(): Formio {
    return this.router.formio as Formio;
  }

  get hook(): FormioHook {
    return this.formio.hook;
  }

  get util() {
    return this.formio.util;
  }

  get template() {
    return this.formio.template;
  }

  get Action() {
    return this.formio.Action;
  }

  async exportTemplate(options: Partial<FormioExportOptions> = {}): Promise<FormioTemplate> {
    return promisify(this.formio.template.export)(options);
  }

  async importTemplate(template: FormioTemplate): Promise<FormioTemplate> {
    return promisify(this.formio.template.import.template)(template);
  }

  encrypt(text: string) {
    return promisify(this.formio.encrypt)(text);
  }

  isInit() {
    return !!this.router;
  }

  async init(options: FormioConfig) {
    if (options && Object.keys(options).length) {
      this.bindLogger();

      this.router = this.createRouter(this.mapConfiguration(options));

      return this.router.init(this.hooksService.getHooks());
    }
  }

  // istanbul ignore next
  public createRouter(options: FormioConfig) {
    return createRouter(options);
  }

  protected bindLogger() {
    const {injector} = this;

    util.log = injector.logger.info.bind(injector.logger);
    util.error = injector.logger.error.bind(injector.logger);
  }

  protected mapConfiguration(options: FormioConfig) {
    const {injector} = this;
    const mongooseSettings = injector.settings.get<MongooseConnectionOptions>("mongoose.0");

    if (mongooseSettings) {
      options.mongo = options.mongo || mongooseSettings.url;
      options.mongoConfig = options.mongoConfig || JSON.stringify(mongooseSettings.connectionOptions);
    }

    return options;
  }
}
