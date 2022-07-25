import {Constant, PlatformContext, ProviderScope, Scope} from "@tsed/common";
import {Env} from "@tsed/core";
import {Inject, Injectable} from "@tsed/di";
import {Account, InteractionResults, PromptDetail, Provider} from "oidc-provider";
import {OidcSession} from "../decorators/oidcSession";
import {OidcClient} from "../domain/interfaces";
import {OidcInteraction} from "../domain/OidcInteraction";
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
  protected $ctx: PlatformContext;

  protected raw: OidcInteraction;

  get session(): OidcSession | undefined {
    return this.raw.session as any;
  }

  get prompt(): PromptDetail {
    return this.raw.prompt;
  }

  get params(): Record<string, any> {
    return this.raw.params;
  }

  get uid(): string {
    return this.raw.uid;
  }

  get grantId(): string {
    return (this.raw as any).grantId;
  }

  async runInteraction(name: string = this.prompt.name) {
    const handler = this.oidcInteractions.getInteractionHandler(name);

    if (handler) {
      await handler(this.$ctx);
    }
  }

  async interactionDetails(): Promise<OidcInteraction> {
    this.raw = await this.oidcProvider.get().interactionDetails(this.$ctx.getReq(), this.$ctx.getRes());

    return this.raw;
  }

  async interactionFinished(result: InteractionResults, options: {mergeWithLastSubmission?: boolean} = {mergeWithLastSubmission: false}) {
    return this.oidcProvider.get().interactionFinished(this.$ctx.getReq(), this.$ctx.getRes(), result, options);
  }

  async interactionResult(result: InteractionResults, options: {mergeWithLastSubmission?: boolean} = {mergeWithLastSubmission: false}) {
    return this.oidcProvider.get().interactionResult(this.$ctx.getReq(), this.$ctx.getRes(), result, options);
  }

  async render(view: string, result: any): Promise<string> {
    return this.$ctx.response.render(view, result);
  }

  async save(ttl: number): Promise<string> {
    return this.raw.save(ttl);
  }

  async findClient(clientId: string = this.params.client_id): Promise<OidcClient | undefined> {
    return this.oidcProvider.get().Client.find(clientId);
  }

  async findAccount(sub?: string, token?: any): Promise<Account | undefined> {
    if (!sub && this.session) {
      sub = this.session?.accountId as any;
    }

    if (!sub) {
      return;
    }

    return this.oidcProvider.get().Account.findAccount(undefined as any, sub!, token);
  }

  async getGrant(): Promise<InstanceType<Provider["Grant"]>> {
    const {Grant} = this.oidcProvider.get() as any;

    if (this.grantId) {
      // we'll be modifying existing grant in existing session
      // @ts-ignore
      return await (this.oidcProvider.get().find || Grant.find)(this.grantId);
    }

    return new Grant({
      accountId: this.session?.accountId,
      clientId: this.params.client_id
    });
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
