import type {
  APIGatewayProxyEvent,
  APIGatewayProxyEventV2,
  APIGatewayTokenAuthorizerEvent,
  CloudWatchLogsEvent,
  DynamoDBStreamEvent,
  KinesisStreamEvent,
  S3Event,
  ScheduledEvent,
  SNSEvent,
  SQSEvent
} from "aws-lambda";

export type ServerlessEvent =
  | APIGatewayProxyEvent
  | APIGatewayProxyEventV2
  | S3Event
  | SQSEvent
  | SNSEvent
  | DynamoDBStreamEvent
  | KinesisStreamEvent
  | CloudWatchLogsEvent
  | ScheduledEvent
  | APIGatewayTokenAuthorizerEvent;
