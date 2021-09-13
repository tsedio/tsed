import {StoreMerge, useDecorators} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {AgendaConfig} from "agenda";
import {PROVIDER_TYPE_AGENDA} from "../constants";

declare global {
  namespace TsED {
    interface Configuration {
      agenda?: {
        /** * Enable Agenda jobs. Default false. */
        enabled?: boolean;
      } & AgendaConfig;
    }
  }
}

interface AgendaOptions {
  namespace?: string;
}

export function Agenda(options?: AgendaOptions): ClassDecorator {
  return useDecorators(
    StoreMerge("agenda", {namespace: options?.namespace}),
    Injectable({
      type: PROVIDER_TYPE_AGENDA
    })
  );
}
