---
meta:
 - name: description
   content: Guide to deploy your Ts.ED application on AWS.
 - name: keywords
   content: ts.ed express typescript aws node.js javascript decorators
projects:   
 - title: Kit AWS
   href: https://github.com/TypedProject/tsed-example-aws
   src: /aws.png   
---
# AWS

<Banner src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/langfr-220px-Amazon_Web_Services_Logo.svg.png" href="https://aws.amazon.com/fr/" :height="180" />

Amazon Web Services is one possible way to host your Node.js application.

This tutorial shows you how to configure the Express application written with Ts.ED, to be executed as an AWS Lambda Function.

More information here: [Official AWS Docs](http://docs.aws.amazon.com/lambda/latest/dg/welcome.html)

<Projects type="examples"/>

## Installation

First, install the `tsed/platform-aws` module:

```bash
npm install --save @tsed/platform-aws
```

## Configuration

Create a new `LambdaServer.ts` in `src` directory:

<<< @/docs/tutorials/snippets/aws/lambda.ts

Then create `lambda.js` on your root project:

```javascript
module.exports = require("./dist/LambdaServer.js");
```

This file will be used by AWS to forward request to your application.

Finally, [package and create your Lambda function](http://docs.aws.amazon.com/lambda/latest/dg/nodejs-create-deployment-pkg.html), 
then configure a simple proxy API using Amazon API Gateway and integrate it with your Lambda function.

See more details on [`aws-serveless-express`](https://github.com/awslabs/aws-serverless-express) project.

## Getting the API Gateway event object

This package includes decorators to easily get the event object Lambda received from API Gateway:

```typescript
import {Controller, Get} from "@tsed/common"; 
import {AwsEvent, AwsContext} from "@tsed/platform-aws"; 

@Controller('/')
class MyCtrl {
 @Get('/')
 get(@AwsEvent() event: any, @AwsContext() context: any) {
   console.log("Event", apiGateway.event);
   console.log("Context", apiGateway.context);
   
   return apiGateway;
 }
}
```

::: tip
You can find a project example with [AWS configuration here](https://github.com/TypedProject/tsed-example-aws).
:::

::: tip Example
You can see an example provided by the AWS Team on this [github repository](https://github.com/awslabs/aws-serverless-express/tree/master/examples/basic-starter).
:::

## Author 

<GithubContributors :users="['Romakita']"/>

## Maintainers <Badge text="Help wanted" />

<GithubContributors :users="['Romakita', 'vetras']"/>

<div class="container--centered container--padded">
<a href="/contributing.html" class="nav-link button">
 Become maintainer
</a>
</div>
