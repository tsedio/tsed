import {Model, ObjectID} from "@tsed/mongoose";
import {DiscriminatorKey, DiscriminatorValue, Required} from "@tsed/schema";

@Model()
class EventModel {
  @ObjectID()
  _id: string;

  @Required()
  time: Date = new Date();

  @DiscriminatorKey()
  type: string;
}

@Model()
class ClickedLinkEventModel extends EventModel {
  @Required()
  url: string;
}

@Model()
@DiscriminatorValue("sign_up_event")
class SignedUpEventModel extends EventModel {
  @Required()
  user: string;
}
