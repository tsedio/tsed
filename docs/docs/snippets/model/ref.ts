import {Property, Ref, Required} from "@tsed/schema";

export class PaymentProvidersResponse {
  @Property()
  @Required()
  @Ref("https://example.com/doc/swagger.json#/components/schemas/NotificationPayloadModel")
  paymentProviders: unknown;
}
