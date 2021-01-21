import {toMap as tMap} from "@tsed/core";
import {Inject, Injectable} from "@tsed/di";
import {MongooseDocument, MongooseModel} from "@tsed/mongoose";
import {promisify} from "util";
import {FormioMapper} from "../builder/FormioMapper";
import {FormioAction} from "../domain/FormioAction";
import {FormioActionItem, FormioForm, FormioRole, FormioSubmission, FormioToken} from "../domain/FormioModels";
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
}
