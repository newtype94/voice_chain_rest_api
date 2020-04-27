# voiceChain backend

- AWS serverless architecture
- rest api

## AWS CLI commands

- install the [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

```
sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket vcrest

sam deploy --template-file packaged.yaml --stack-name voice-chain-rest --capabilities CAPABILITY_IAM

aws cloudformation describe-stacks --stack-name simple-websocket-chat-app --query 'Stacks[].Outputs'
```
