import {StoreMerge, useDecorators} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {AgendaConfig} from "agenda";
import {PROVIDER_TYPE_AGENDA} from "../constants/constants";

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
    options?.namespace && StoreMerge("agenda", options),
    Injectable({
      type: PROVIDER_TYPE_AGENDA
    })
  );
}
