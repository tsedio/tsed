import {Required} from "@tsed/schema";
import {Model, ObjectID, DiscriminatorKey} from "@tsed/mongoose";

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

@Model({discriminatorValue: "signUpEvent"})
class SignedUpEventModel extends EventModel {
  @Required()
  user: string;
}
