import {EngineOptions} from "../components/Engine.js";
import {engines} from "../registries/EnginesContainer.js";

export type RenderCallback = (err: Error | null, str?: string | any) => any;
export interface EngineFunction {
  (path: string, options: any, cb: RenderCallback): void;
  (path: string, options: any): Promise<string>;

  render(template: string, options: any, cb: RenderCallback): void;
  render(template: string, options: any): Promise<string>;
}

const callbackify = async (fn: any, cb?: RenderCallback) => {
  try {
    const html = await fn();
    cb && cb(null, html);
    return html;
  } catch (er) {
    if (cb) {
      cb(er);
    } else {
      throw er;
    }
  }
};

export function getEngine(name: string): EngineFunction {
  const cb = async (path: string, options: any, cb?: RenderCallback) => {
    const engine = engines.get(name)!;
    await engine.$onInit();

    return callbackify(() => engine.renderFile(path, options), cb);
  };

  cb.render = async (template: string, options: EngineOptions, cb: RenderCallback) => {
    const engine = engines.get(name)!;
    await engine.$onInit();

    return callbackify(() => engine.render(template, options), cb);
  };

  return cb as any;
}

let localEngines: any;

export function getEngines(): Record<string, EngineFunction> {
  localEngines =
    localEngines ||
    engines.getSupportedEngines().reduce((acc, key) => {
      return {
        ...acc,
        [key]: getEngine(key)
      };
    }, {});

  return localEngines;
}
