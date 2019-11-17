# Ts.ED - AWS

Here an example to configure your server with AWS

See [Ts.ED](https://tsed.io) project for more information.

## Checkout

This repository provide a project example for each Ts.ED version since `v5.18.1`.

```bash
git checkout -b https://github.com/TypedProject/tsed-example-aws/tree/v5.18.1
```

To checkout another version just replace `v5.18.1` by the desired version.

## Install

> **Important!** Ts.ED requires Node >= 8, Express >= 4 and TypeScript >= 3.

```bash
npm install
```

## Configuration 

Source: https://github.com/awslabs/aws-serverless-express/tree/master/examples/basic-starter

This guide assumes you have already set up an AWS account and have the latest version of the AWS CLI installed.

Run:
```bash
npm run config -- --account-id="<accountId>" --bucket-name="<bucketName>" [--region="<region>" --function-name="<functionName>"]
```
> eg. `npm run config -- --account-id="123456789012" --bucket-name="my-unique-bucket".`

This modifies `package.json`, `simple-proxy-api.yaml` and `cloudformation.yaml` with your account ID, bucket, region and function name
 (region defaults to us-east-1 and function name defaults to AwsServerlessExpressFunction). 
 
If the bucket you specify does not yet exist, the next step will create it for you.
This step modifies the existing files in-place; if you wish to make changes to these settings, 
you will need to modify `package.json`, `simple-proxy-api.yaml` and `cloudformation.yaml` manually.

Then run:
```bash
npm run build
npm run setup
```
This command installs the node dependencies, creates an S3 bucket (if it does not already exist), packages and deploys your serverless Express application to AWS Lambda, and creates an API Gateway proxy API.

After the setup command completes, open the AWS CloudFormation console https://console.aws.amazon.com/cloudformation/home and switch to the region you specified. Select the AwsServerlessExpressStack stack, then click the ApiUrl value under the Outputs section - this will open a new page with your running API. The API index lists the resources available in the example Express server (app.js), along with example curl commands.

## Development

```bash
npm start
```

## Contributing

You can make a PR directly on https://github.com/TypedProject/ts-express-decorators repository.

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/tiers/backer.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2019 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[travis]: https://travis-ci.org/
