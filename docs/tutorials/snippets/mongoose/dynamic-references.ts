import {DynamicRef, Model, ObjectID} from "@tsed/mongoose";
import {Enum, Required} from "@tsed/schema";

@Model()
class ClickedLinkEventModel {
  @ObjectID("id")
  _id: string;

  @Required()
  url: string;
}

@Model()
class SignedUpEventModel {
  @ObjectID("id")
  _id: string;

  @Required()
  user: string;
}

@Model()
class EventModel {
  @ObjectID("id")
  _id: string;

  @DynamicRef("eventType", ClickedLinkEventModel, SignedUpEventModel)
  event: DynamicRef<ClickedLinkEventModel | SignedUpEventModel>;

  @Enum("ClickedLinkEventModel", "SignedUpEventModel")
  eventType: "ClickedLinkEventModel" | "SignedUpEventModel";
}
