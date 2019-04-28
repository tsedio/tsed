import {Type} from "@tsed/core";
import {OverrideProvider} from "@tsed/di";
import {IProtocolOptions} from "../interfaces/IProtocolOptions";
import {ProtocolRegistry} from "../registries/ProtocolRegistries";

/**
 * Override a protocol which is already registered in ProtocolRegistry.
 *
 * ## Usage
 *
 * ```typescript
 * import {LocalProtocol, OverrideProtocol} from "@tsed/passport";
 *
 * @OverrideProtocol(LocalProtocol, {})
 * export class CustomLocalProtocol extends LocalProtocol implement OnInstall, OnVerify {
 *   public $onInstall() {
 *
 *   }
 *
 *   public $onVerify() {
 *
 *   }
 * }
 * ```
 *
 * @returns {Function}
 * @decorators
 * @param originalProvider
 * @param settings
 */
// tslint:disable-next-line: variable-name
export function OverrideProtocol(originalProvider: Type<any>, settings: Partial<IProtocolOptions> = {}) {
  return (target: Type<any>) => {
    OverrideProvider(originalProvider)(target);
    ProtocolRegistry.get(target)!.store.merge("protocol", settings);
  };
}
