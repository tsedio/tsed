import {isArray, isObject, isString, toMap as tMap} from "@tsed/core";
import {Inject, Injectable} from "@tsed/di";
import {FormioAction, FormioActionItem, FormioForm, FormioRole, FormioSubmission, FormioToken} from "@tsed/formio-types";
import {MongooseDocument, MongooseModel} from "@tsed/mongoose";
import omit from "lodash/omit.js";
import type {FilterQuery} from "mongoose";

import {FormioMapper} from "../builder/FormioMapper.js";
import {isMongoId} from "../utils/isMongoId.js";
import {FormioService} from "./FormioService.js";

function toMap<T>(list: any[]) {
  return tMap<string, MongooseDocument<T>>(list, (o: any) => [o._id.toString(), `$machineName:${o.name || o.machineName}`]);
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
    return !!(await this.formModel.countDocuments({name: {$eq: name}}));
  }

  getForm(nameOrId: string) {
    return this.formModel
      .findOne({
        deleted: {$eq: null},
        ...(isMongoId(nameOrId)
          ? {
              _id: nameOrId
            }
          : {name: {$eq: nameOrId}})
      })
      .lean()
      .exec();
  }

  /**
   * Import form previously exported by export tool.
   * This method transform alias to a real mongoose _id
   * @param form
   * @param onCreate
   */
  async importFormIfNotExists(form: FormioForm, onCreate?: (form: FormioForm) => any) {
    if (!(await this.hasForm(form.name))) {
      const createForm = await this.importForm(form);

      onCreate && (await onCreate(createForm));
    }

    return this.getForm(form.name);
  }

  /**
   * Import form previously exported by export tool.
   * This method transform alias to a real mongoose _id
   * @param form
   */
  async importForm(form: FormioForm) {
    const mapper = await this.getFormioMapper();

    return this.saveForm(mapper.mapToImport(form));
  }

  saveForm(form: FormioForm) {
    form = new this.formModel(omit(form, ["__v"]) as any);

    return this.formModel.findOneAndUpdate({_id: form._id}, form, {upsert: true, new: true});
  }

  getSubmissions<Data>(
    query: FilterQuery<MongooseModel<FormioSubmission<Data>>> = {}
  ): Promise<MongooseDocument<FormioSubmission<Data>>[]> {
    return this.submissionModel.find({
      ...query,
      deleted: {$eq: null}
    }) as any;
  }

  /**
   * Import submission previously exported by export tool.
   * This method transform alias to a real mongoose _id
   * @param submission
   */
  async importSubmission<Data = any>(submission: Omit<Partial<FormioSubmission<Data>>, "form"> & {form?: any}) {
    const mapper = await this.getFormioMapper();

    return this.saveSubmission(mapper.mapToImport(submission));
  }

  saveSubmission<Data = any>(submission: Partial<FormioSubmission<Data>>) {
    submission = new this.submissionModel(omit(submission, ["__v"]));

    return this.submissionModel.findOneAndUpdate(
      {
        _id: submission._id
      },
      submission,
      {new: true, upsert: true}
    );
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
