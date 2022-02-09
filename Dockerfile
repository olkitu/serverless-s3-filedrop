FROM node:14

ENV NODE_ENV=local

WORKDIR /usr/src/app

RUN npm install --global serverless@2 serverless-offline

EXPOSE 4000

ENTRYPOINT [ "sh", "/usr/src/app/docker-entrypoint.sh" ]
CMD [ "sls", "offline", "--host", "0.0.0.0", "--noPrependStageInUrl" ]