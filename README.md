# Serverless S3 FileDrop

Simple File Drop service to run in AWS. 

* Upload using Pregenerated URL via Web UI
* Email Notification and download link when new file uploaded

## How this works?

1. Get Presigned URL

![Get Presigned URL](docs/01-Get-PreSign-URL.drawio.png)

2. Upload to S3 Bucket

![Upload to S3 Bucket](docs/02-Upload-to-S3.drawio.png)

3. Automatically notify user via AWS SES Service. You have to have domain verified in SES service.

## Deploy

You have to setup AWS Access Keys to deploy.

Install required Node-packages

```
npm ci
```

Configure environment variables in `.env` file before deploy. 

```
cp .env.example .env
serverless deploy
```

## Develop

Our development environment is build in Docker. This will create automatically development environment to localhost.

```
cp .env.example .env
docker-compose build
docker-compose up -d
```

With docker-compose will start containers:

| Container       | Exposed Port(s) | Description                                    |
|-----------------|-----------------|------------------------------------------------|
| Proxy (Traefik) | 80, 8080        | Frontend Load Balancer                         |
| Web (Nginx)     | -               | Webserver for static website                   |
| API (Node)      | -               | NodeJS API server for Lambda function          |
| Minio           | 9000, 34697     | Local S3 Bucket                                |
| Mc (Minio CLI)  | -               | To create automatically S3 bucket during start |

Add to your computer hosts file `127.0.0.1 minio` to use containers in localhost. Minio admin username is `minio` and password `minio1234`.

The email notification function do not work in local environment.