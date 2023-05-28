import {Constant, InjectContext, PlatformContext} from "@tsed/common";
import {Env} from "@tsed/core";
import {Inject, Injectable} from "@tsed/di";
import {Unauthorized} from "@tsed/exceptions";
import {serialize} from "@tsed/json-mapper";
// @ts-ignore
import type {Account, InteractionResults, PromptDetail, default as Provider} from "oidc-provider";
import {
  INTERACTION_CONTEXT,
  INTERACTION_DETAILS,
  INTERACTION_GRANT_ID,
  INTERACTION_PARAMS,
  INTERACTION_PROMPT,
  INTERACTION_SESSION,
  INTERACTION_UID
} from "../constants/constants";
import {OidcSession} from "../decorators/oidcSession";
import {OidcClient, OidcInteraction} from "../domain/interfaces";
import {OidcBadInteractionName} from "../domain/OidcBadInteractionName";
import {OidcInteractionPromptProps} from "../domain/OidcInteractionPromptProps";
import {debug} from "../utils/debug";
import {OidcInteractions} from "./OidcInteractions";
import {OidcProvider} from "./OidcProvider";

@Injectable()
export class OidcInteractionContext {
  @Constant("env")
  env: Env;

  @Inject()
  protected oidcProvider: OidcProvider;

  @Inject()
  protected oidcInteractions: OidcInteractions;

  @InjectContext()
  protected $ctx: PlatformContext;

  get raw(): OidcInteraction {
    return this.$ctx.get(INTERACTION_DETAILS)!;
  }

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

  async runInteraction(name?: string) {
    name = name || this.prompt.name;

    const handler = this.oidcInteractions.getInteractionHandler(name);

    if (handler) {
      this.raw.prompt = {
        ...this.raw.prompt,
        name,
        reasons: [name]
      };

      await handler(this.$ctx);
    }
  }

  async interactionDetails(): Promise<OidcInteraction> {
    const raw = await this.oidcProvider.get().interactionDetails(this.$ctx.getReq(), this.$ctx.getRes());
    const {uid, prompt, params, session, grantId} = raw as any;

    this.$ctx.set(INTERACTION_CONTEXT, this);
    this.$ctx.set(INTERACTION_DETAILS, raw);
    this.$ctx.set(INTERACTION_UID, uid);
    this.$ctx.set(INTERACTION_PROMPT, prompt);
    this.$ctx.set(INTERACTION_PARAMS, params);
    this.$ctx.set(INTERACTION_GRANT_ID, grantId);
    this.$ctx.set(INTERACTION_SESSION, session);

    return raw;
  }

  interactionFinished(
    result: InteractionResults,
    options: {
      mergeWithLastSubmission?: boolean;
    } = {mergeWithLastSubmission: false}
  ) {
    return this.oidcProvider.get().interactionFinished(this.$ctx.getReq(), this.$ctx.getRes(), result, options);
  }

  interactionResult(
    result: InteractionResults,
    options: {
      mergeWithLastSubmission?: boolean;
    } = {mergeWithLastSubmission: false}
  ) {
    return this.oidcProvider.get().interactionResult(this.$ctx.getReq(), this.$ctx.getRes(), result, options);
  }

  async interactionPrompt({client, ...options}: Record<string, any>): Promise<OidcInteractionPromptProps> {
    client = client || (await this.findClient());

    const newClient = serialize(client, {useAlias: false, groups: ["render"]});

    // remove client secret from
    delete (newClient as any).clientSecret;

    return {
      client: newClient,
      uid: this.uid,
      grantId: this.grantId,
      details: this.prompt.details,
      params: {
        ...this.params,
        ...options.params
      },
      ...options,
      ...this.debug()
    };
  }

  render(view: string, result: any): Promise<string> {
    return this.$ctx.response.render(view, result);
  }

  save(ttl: number): Promise<string> {
    return this.raw.save(ttl);
  }

  findClient(clientId: string = this.params.client_id): Promise<OidcClient | undefined> {
    const key = `$client:${clientId}`;

    return this.$ctx.cacheAsync(key, () => this.oidcProvider.get().Client.find(clientId));
  }

  findAccount(sub?: string, token?: any): Promise<Account | undefined> {
    if (!sub && this.session) {
      sub = this.session?.accountId as any;
    }

    if (!sub) {
      return Promise.resolve(undefined);
    }

    const key = `$account:${sub}`;

    return this.$ctx.cacheAsync<Account | undefined>(key, (() => {
      return this.oidcProvider.get().Account.findAccount(undefined as any, sub!, token);
    }) as any);
  }

  getGrant(): Promise<InstanceType<Provider["Grant"]>> {
    const {Grant} = this.oidcProvider.get() as any;

    if (this.grantId) {
      // we'll be modifying existing grant in existing session
      // @ts-ignore
      return Grant.find(this.grantId);
    }

    return Promise.resolve(
      new Grant({
        accountId: this.session?.accountId,
        clientId: this.params.client_id
      })
    );
  }

  checkInteractionName(name: string) {
    if (this.prompt.name !== name) {
      throw new OidcBadInteractionName("Bad interaction name");
    }
  }

  async checkClientId(clientId = this.params.client_id) {
    const client = await this.findClient(clientId);

    if (!client) {
      throw new Unauthorized(`Unknown client_id ${clientId}`);
    }
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
