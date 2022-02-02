# Serverless S3 FileDrop

Simple File Drop service to run in AWS. 

## Deploy

You have to setup AWS Access Keys to deploy.

Install required Node-packages

```
npm ci
```

And then deploy to AWS. Change `PREFIX` to prefix you like to use. This will be used in S3 bucket name eg.

```
ENV=stage PREFIX=prefixULikeToChoose serverless deploy
```