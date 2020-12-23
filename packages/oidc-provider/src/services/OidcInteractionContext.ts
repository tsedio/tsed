import {Constant, PlatformContext, ProviderScope, Scope} from "@tsed/common";
import {Env} from "@tsed/core";
import {Inject, Injectable} from "@tsed/di";
import {Account, AnyObject, InteractionResults, PromptDetail} from "oidc-provider";
import {OidcSession} from "../decorators";
import {OidcClient, OidcInteraction} from "../domain";
import {debug} from "../utils/debug";
import {OidcInteractions} from "./OidcInteractions";
import {OidcProvider} from "./OidcProvider";

@Injectable()
@Scope(ProviderScope.REQUEST)
export class OidcInteractionContext {
  @Constant("env")
  env: Env;

  @Inject()
  protected oidcProvider: OidcProvider;

  @Inject()
  protected oidcInteractions: OidcInteractions;

  @Inject()
  protected context: PlatformContext;

  protected raw: OidcInteraction;

  get session(): OidcSession | undefined {
    return this.raw.session as any;
  }

  get prompt(): PromptDetail {
    return this.raw.prompt;
  }

  get params(): AnyObject {
    return this.raw.params;
  }

  get uid(): string {
    return this.raw.uid;
  }

  async runInteraction(name: string = this.prompt.name) {
    const handler = this.oidcInteractions.getInteractionHandler(name);

    if (handler) {
      await handler(this.context);
    }
  }

  async interactionDetails(): Promise<OidcInteraction> {
    this.raw = await this.oidcProvider.get().interactionDetails(this.context.getReq(), this.context.getRes());

    return this.raw;
  }

  async interactionFinished(result: InteractionResults, options: {mergeWithLastSubmission?: boolean} = {mergeWithLastSubmission: false}) {
    return this.oidcProvider.get().interactionFinished(this.context.getReq(), this.context.getRes(), result, options);
  }

  async interactionResult(result: InteractionResults, options: {mergeWithLastSubmission?: boolean} = {mergeWithLastSubmission: false}) {
    return this.oidcProvider.get().interactionResult(this.context.getReq(), this.context.getRes(), result, options);
  }

  async setProviderSession(options: {
    account: string;
    ts?: number;
    remember?: boolean;
    clients?: string[];
    meta?: AnyObject;
  }): Promise<OidcSession> {
    return this.oidcProvider.get().setProviderSession(this.context.getReq(), this.context.getRes(), options);
  }

  async render(view: string, result: any): Promise<string> {
    return this.context.response.render(view, result);
  }

  async save(ttl?: number): Promise<string> {
    return this.raw.save(ttl);
  }

  async findClient(clientId: string = this.params.client_id): Promise<OidcClient | undefined> {
    return this.oidcProvider.get().Client.find(clientId);
  }

  async findAccount(sub?: string, token?: any): Promise<Account | undefined> {
    if (!sub && this.session) {
      sub = this.session.accountId() as any;
    }

    if (!sub) {
      return;
    }

    return this.oidcProvider.get().Account.findAccount(undefined as any, sub!, token);
  }

  debug(obj?: any): any {
    /* istanbul ignore next */
    if (this.env === Env.PROD) {
      return {session: undefined, dbg: {params: undefined, prompt: undefined}};
    }

    if (obj) {
      return debug(obj);
    }

    return {
      session: this.session ? this.debug(this.session) : undefined,
      dbg: {
        params: this.debug(this.params),
        prompt: this.debug(this.prompt)
      }
    };
  }
}
