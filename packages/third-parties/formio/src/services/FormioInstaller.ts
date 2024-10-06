import {Inject, Injectable} from "@tsed/di";
import {Logger} from "@tsed/logger";

import {FormioSubmission} from "../domain/FormioModels.js";
import {FormioTemplate} from "../domain/FormioTemplate.js";
import {FormioDatabase} from "./FormioDatabase.js";

@Injectable()
export class FormioInstaller extends FormioDatabase {
  @Inject()
  protected logger: Logger;

  async install(template: FormioTemplate, root: any) {
    this.logger.info("Install formio template...");
    template = await this.formio.importTemplate(template);

    if (root) {
      this.logger.info("Create root user...");
      await this.createRootUser(root, template);
    }
  }

  async createRootUser<User = unknown>(user: {email: string; password: string}, template: FormioTemplate): Promise<FormioSubmission<User>> {
    const hash = await this.formio.encrypt(user.password);

    return new Promise((resolve, reject) => {
      this.formio.resources.submission.model.create(
        {
          form: template.resources.admin._id,
          data: {
            email: user.email,
            password: hash
          },
          roles: [template.roles?.administrator._id].filter(Boolean)
        },
        (err: unknown, item: any) => {
          if (err) {
            return reject(err);
          }

          resolve(item);
        }
      );
    });
  }
}
