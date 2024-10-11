import {isFunction} from "@tsed/core";
import {Inject, Injectable} from "@tsed/di";
import {BadRequest, NotFound, Unauthorized} from "@tsed/exceptions";
import {PlatformContext, Req} from "@tsed/platform-http";
import {promisify} from "util";

import {FormioPayloadToken} from "../domain/FormioDecodedToken.js";
import {FormioForm, FormioSubmission, WithID} from "../domain/FormioModels.js";
import {FormioDatabase} from "./FormioDatabase.js";
import {FormioHooksService} from "./FormioHooksService.js";
import {FormioService} from "./FormioService.js";

@Injectable()
export class FormioAuthService {
  @Inject()
  formio: FormioService;

  @Inject()
  hooks: FormioHooksService;

  @Inject()
  db: FormioDatabase;

  get currentUser() {
    return promisify(this.formio.auth.currentUser);
  }

  get getToken() {
    return this.formio.auth.getToken;
  }

  get tempToken() {
    return this.formio.auth.tempToken;
  }

  get logout() {
    return this.formio.auth.logout;
  }

  setCurrentUser<User = any>(user: WithID<FormioSubmission<User>>, token: FormioPayloadToken, ctx: PlatformContext) {
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    request.submission.data = user.data;
    request.user = user;
    request.token = token.decoded;
    response.token = token.token;
    request["x-jwt-token"] = token.token;

    return this;
  }

  /**
   * Generate the payload token for the session
   * @param user
   * @param ctx
   */
  async generatePayloadToken<User = any>(
    user: WithID<FormioSubmission<User>>,
    ctx: PlatformContext
  ): Promise<{user: WithID<FormioSubmission<User>>; token: FormioPayloadToken}> {
    const req = ctx.getRequest();
    const audit = this.formio.audit;
    let form: FormioForm | null;

    try {
      form = (await this.db.getForm(user.form)) as any;
    } catch (err) {
      audit(
        "EAUTH_USERFORM",
        {
          ...req,
          userId: user._id
        },
        user.form,
        err
      );
      throw err;
    }

    if (!form) {
      audit(
        "EAUTH_USERFORM",
        {
          ...req,
          userId: user._id
        },
        user.form,
        {message: "User form not found"}
      );

      throw new NotFound("User form not found.");
    }

    try {
      user = await this.hooks.alterAsync("user", user);
    } catch (err) {
      // istanbul ignore next
      ctx.logger.debug(err);
    }

    await this.hooks.alterAsync("login", user, req);

    // Allow anyone to hook and modify the token.
    const token = this.hooks.alter(
      "token",
      {
        user: {
          _id: user._id
        },
        form: {
          _id: form?._id
        }
      },
      form,
      req
    );

    const decoded = this.hooks.alter("tokenDecode", token, req);

    return {
      user,
      token: {
        token: this.getToken(token) as string,
        decoded
      }
    };
  }

  /**
   * Generate session from the given authenticated user.
   * @param user
   * @param ctx
   */
  async generateSession<User = any>(user: WithID<FormioSubmission<User>>, ctx: PlatformContext) {
    try {
      const {user: userSession, token} = await this.generatePayloadToken(user, ctx);
      this.setCurrentUser(userSession, token, ctx);

      await this.currentUser(ctx.getRequest(), ctx.getResponse());
    } catch (err) {
      ctx.logger.error({event: "Error on OAuthActions", error: err});
      throw new Unauthorized(err.message);
    }
  }

  /**
   * Retrieve roles
   * @param req
   */
  async getRoles(req?: Req) {
    try {
      const query = this.hooks.alter("roleQuery", {deleted: {$eq: null}}, req);
      return await this.db.roleModel.find(query).sort({title: 1}).lean().exec();
    } catch (err) {
      throw new BadRequest(this.formio.util.errorCodes.role.EROLESLOAD);
    }
  }

  /**
   * Update the role of the current user submission
   * @param _id
   * @param role
   * @param req
   */
  async updateUserRole(_id: string | any, role: string, req?: Req) {
    const query = this.hooks.alter(
      "submissionQuery",
      {
        _id: this.formio.util.idToBson(_id),
        deleted: {$eq: null}
      },
      req
    );

    const user = await this.db.submissionModel.findOne(query).exec();

    if (!user) {
      throw new BadRequest("No Submission was found with the given setting `submission`.");
    }

    user.roles = [this.formio.util.idToBson(role)];

    if (isFunction(user.save)) {
      await user.save();
    }

    return user;
  }

  /**
   * Create a user submission in formio
   * @param user
   */
  async createUser<User = any>(user: Partial<FormioSubmission<User>>) {
    const submission = new this.db.submissionModel({
      owner: null,
      deleted: null,
      roles: [],
      externalsIds: [],
      ...user,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    });

    user.form && (submission.form = this.db.idToBson(user.form));

    await submission.save();

    return submission.toObject();
  }

  /**
   * Update user submission in formio
   * @param user
   */
  async updateUser<User = any>(user: WithID<FormioSubmission<User>>) {
    await this.db.submissionModel.updateOne(
      {
        _id: user._id
      },
      {$set: user}
    );

    return user;
  }
}
