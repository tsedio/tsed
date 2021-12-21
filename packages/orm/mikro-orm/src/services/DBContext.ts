import {Injectable} from "@tsed/di";
import {EntityManager} from "@mikro-orm/core";
import {AsyncLocalStorage} from "async_hooks";

@Injectable()
export class DBContext {
  private readonly storage = new AsyncLocalStorage<Map<string, EntityManager>>();

  constructor() {
    if (AsyncLocalStorage) {
      this.storage = new AsyncLocalStorage();
    } else {
      throw new Error(`AsyncLocalStorage is not available for your Node.js version (${process.versions.node}).`);
    }
  }

  public run<R>(ctx: Map<string, EntityManager>, callback: (...args: any[]) => R): R {
    return this.storage.run(ctx, callback);
  }

  public getContext(): Map<string, EntityManager> | undefined {
    return this.storage.getStore();
  }

  public get(contextName: string): EntityManager | undefined {
    const context = this.getContext();

    return context?.get(contextName);
  }

  public has(contextName: string): boolean {
    const context = this.getContext();

    return !!context?.has(contextName);
  }
}
