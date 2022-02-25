import {isArray, isObject, isString, toMap as tMap} from "@tsed/core";
import {Inject, Injectable} from "@tsed/di";
import {MongooseDocument, MongooseModel} from "@tsed/mongoose";
import {FormioAction, FormioActionItem, FormioForm, FormioRole, FormioSubmission, FormioToken} from "@tsed/formio-types";
import {FormioMapper} from "../builder/FormioMapper";
import {isMongoId} from "../utils/isMongoId";
import {FormioService} from "./FormioService";

function toMap<T>(list: any[]) {
  return tMap<string, MongooseDocument<T>>(list, (o: any) => [o._id.toString(), `$machineName:${o.machineName}`]);
}

@Injectable()
export class FormioDatabase {
  @Inject()
  protected formio: FormioService;

  get models() {
    return this.formio.mongoose.models;
  }

  get roleModel(): MongooseModel<FormioRole> {
    return this.models.role;
  }

  get formModel(): MongooseModel<FormioForm> {
    return this.models.form;
  }

  get actionModel(): MongooseModel<FormioAction> {
    return this.models.action;
  }

  get submissionModel(): MongooseModel<FormioSubmission> {
    return this.models.submission;
  }

  get tokenModel(): MongooseModel<FormioToken> {
    return this.models.token;
  }

  get actionItemModel(): MongooseModel<FormioActionItem> {
    return this.models.actionItem;
  }

  async getFormioMapper(): Promise<FormioMapper> {
    const [roles, forms, actions] = await Promise.all([
      this.roleModel.find({
        deleted: {$eq: null}
      }),
      this.formModel.find({
        deleted: {$eq: null}
      }),
      this.actionModel.find({
        deleted: {$eq: null}
      })
    ]);

    return new FormioMapper({
      forms: toMap<FormioForm>(forms),
      actions: toMap<FormioAction>(actions),
      roles: toMap<FormioRole>(roles)
    });
  }

  async hasForms(): Promise<boolean> {
    return (await this.formModel.countDocuments()) > 0;
  }

  async hasForm(name: string): Promise<boolean> {
    return !!(await this.formModel.countDocuments({machineName: {$eq: name}}));
  }

  async getForm(nameOrId: string) {
    return this.formModel
      .findOne({
        deleted: {$eq: null},
        ...(isMongoId(nameOrId)
          ? {
              _id: nameOrId
            }
          : {machineName: {$eq: nameOrId}})
      })
      .lean()
      .exec();
  }

  async createFormIfNotExists(form: FormioForm, onCreate?: (form: FormioForm) => any) {
    if (!(await this.hasForm(form.name))) {
      const createForm = await this.saveFormDefinition(form);

      onCreate && (await onCreate(createForm));
    }

    return this.getForm(form.name);
  }

  async saveFormDefinition(form: FormioForm) {
    const mapper = await this.getFormioMapper();
    const instance = new this.formModel(mapper.mapToImport(form));

    await this.formModel.updateOne({_id: instance._id}, {$set: instance}, {upsert: true});

    return instance;
  }

  idToBson(form?: any) {
    if (isArray(form)) {
      return {$in: form.map(this.formio.util.idToBson)};
    } else if (isObject(form)) {
      return this.formio.util.idToBson((form as any)._id);
    } else if (isString(form)) {
      return this.formio.util.idToBson(form);
    }
  }
}
