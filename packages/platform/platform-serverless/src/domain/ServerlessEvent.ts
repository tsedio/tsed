import type {
  APIGatewayProxyEvent,
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
  | S3Event
  | SQSEvent
  | SNSEvent
  | DynamoDBStreamEvent
  | KinesisStreamEvent
  | CloudWatchLogsEvent
  | ScheduledEvent
  | APIGatewayTokenAuthorizerEvent;
