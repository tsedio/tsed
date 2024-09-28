import {StoreMerge, useDecorators} from "@tsed/core";
import {Injectable} from "@tsed/di";

import {PROVIDER_TYPE_AGENDA} from "../constants/constants.js";

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
