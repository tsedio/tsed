import {StoreMerge, useDecorators} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {PROVIDER_TYPE_AGENDA} from "../constants";

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
