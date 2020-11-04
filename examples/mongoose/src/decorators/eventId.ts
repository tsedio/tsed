import {useDecorators} from "@tsed/core";
import {ObjectID} from "@tsed/mongoose";
import {Description} from "@tsed/schema";

export function EventId() {
  return useDecorators(ObjectID(), Description("The event id"));
}
