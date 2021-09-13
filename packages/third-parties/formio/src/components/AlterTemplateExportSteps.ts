import {getValue} from "@tsed/core";
import {Inject} from "@tsed/di";
import {MongooseDocument} from "@tsed/mongoose";
import {FormioMapper} from "../builder/FormioMapper";
import {Alter} from "../decorators/alter";
import {AlterHook} from "../domain/AlterHook";
import {FormioSubmission} from "../domain/FormioModels";
import {FormioTemplate} from "../domain/FormioTemplate";
import {FormioDatabase} from "../services/FormioDatabase";

const async = require("async");

@Alter("templateExportSteps")
export class AlterTemplateExportSteps implements AlterHook {
  @Inject()
  protected database: FormioDatabase;

  transform(queue: any[], template: FormioTemplate, map: any, options: any): any {
    queue.push(async.apply(this.exportSubmissions.bind(this), template, map, options));

    return queue;
  }

  protected async exportSubmissions(template: FormioTemplate, map: any, options: any, next: any) {
    const [mapper, submissions] = await Promise.all([
      this.database.getFormioMapper(),
      this.database.submissionModel.find({
        deleted: {$eq: null}
      })
    ]);

    template.submissions = await this.mapSubmissions(submissions, mapper);

    next(null, template);
  }

  protected mapSubmissions(submissions: MongooseDocument<FormioSubmission>[], mapper: FormioMapper) {
    return submissions
      .map((submission) => submission.toObject())
      .reduce((acc: any, {_id, created, updated, modified, __v, owner, roles, form, metadata, ...submission}) => {
        const machineName = mapper.mapToExport(form.toString());
        const key = machineName.replace("$machineName:", "");

        acc[key] = getValue(acc, key, []);

        acc[key].push({
          ...submission,
          created: created && created.toString(),
          modified: modified && modified.toString(),
          data: mapper.mapToExport(submission.data),
          roles: mapper.mapToExport(roles).filter(Boolean),
          form: mapper.mapToExport(form)
        });

        return acc;
      }, {});
  }
}
