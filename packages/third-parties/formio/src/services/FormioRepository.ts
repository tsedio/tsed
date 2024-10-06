import {Inject} from "@tsed/di";
import {MongooseDocument, MongooseModel} from "@tsed/mongoose";
import type {FilterQuery} from "mongoose";

import {FormioSubmission} from "../domain/FormioModels.js";
import {FormioDatabase} from "./FormioDatabase.js";

export abstract class FormioRepository<SubmissionData = any> {
  @Inject()
  protected formioDatabase: FormioDatabase;

  protected abstract formName: string;

  private formId: string;

  async getFormId() {
    if (!this.formId) {
      const form = await this.formioDatabase.formModel.findOne({name: {$eq: this.formName}});

      if (form) {
        this.formId = form._id;
      }
    }

    return this.formId;
  }

  async saveSubmission(submission: Omit<Partial<FormioSubmission<SubmissionData>>, "form"> & {form?: any}) {
    return this.formioDatabase.saveSubmission<SubmissionData>({
      ...submission,
      form: submission.form || (await this.getFormId())
    });
  }

  async getSubmissions(query: FilterQuery<MongooseModel<FormioSubmission<SubmissionData>>> = {}) {
    return this.formioDatabase.getSubmissions<SubmissionData>({
      ...query,
      form: await this.getFormId()
    });
  }

  async findOneSubmission(query: any): Promise<MongooseDocument<FormioSubmission<SubmissionData>> | undefined> {
    return this.formioDatabase.submissionModel.findOne({
      form: await this.getFormId(),
      deleted: null,
      ...query
    }) as any;
  }
}
