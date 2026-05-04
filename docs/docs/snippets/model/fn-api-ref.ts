import {s} from "@tsed/schema";

export const PaymentProvidersResponseSchema = s.object({
  paymentProviders: s.$ref("https://example.com/doc/swagger.json#/components/schemas/NotificationPayloadModel").required()
});
