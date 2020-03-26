# voiceChain backend

- AWS serverless architecture
- rest api

## AWS CLI commands

- install the [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

```
sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket newtyperest

sam deploy --template-file packaged.yaml --stack-name voice-chain-rest-api --capabilities CAPABILITY_IAM --parameter-overrides TableName=tables

aws cloudformation describe-stacks --stack-name simple-websocket-chat-app --query 'Stacks[].Outputs'
```
