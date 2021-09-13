import {Inject} from "@tsed/di";
import {FormioMapper} from "../builder/FormioMapper";
import {Alter} from "../decorators/alter";
import {AlterHook} from "../domain/AlterHook";
import {FormioSubmission} from "../domain/FormioModels";
import {FormioTemplate} from "../domain/FormioTemplate";
import {FormioDatabase} from "../services/FormioDatabase";

const async = require("async");

@Alter("templateImportSteps")
export class AlterTemplateImportSteps implements AlterHook {
  @Inject()
  protected database: FormioDatabase;

  transform(queue: any[], install: Function, template: Partial<FormioTemplate>): any {
    queue.push(async.apply(this.importSubmissions.bind(this), template));

    return queue;
  }

  protected async importSubmissions(template: Partial<FormioTemplate>, done: any) {
    if (template && template.submissions) {
      // clean all submissions
      await this.database.submissionModel.deleteMany({});

      const ctxData = await this.database.getFormioMapper();
      const entries = Object.entries(template.submissions);

      for (const entry of entries) {
        for (const submission of entry[1]) {
          await this.importSubmission({...submission, form: submission.form || entry[0]}, ctxData);
        }
      }
    }

    done();
  }

  protected async importSubmission(submission: Partial<FormioSubmission>, mapper: FormioMapper) {
    const value = {
      ...mapper.mapToImport(submission),
      roles: [...new Set(mapper.mapToImport(submission.roles || []))].filter(Boolean)
    };

    await this.database.submissionModel.create(value);

    return value;
  }
}
