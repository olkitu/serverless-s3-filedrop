"use strict";

const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION })
let s3 = new AWS.S3({
  signatureVersion: 'v4'
})

if(process.env.NODE_ENV === 'local') {
    s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.AWS_S3_ENDPOINT,
    s3ForcePathStyle: true,
    signatureVersion: 'v4'
  })
}


module.exports.run = async (event) => {

  if(event.pathParameters == null) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing Key"
      })
    }
  }

  const random = (Math.random() + 1).toString(36).substring(4);
  const Key = random + '/' + event.pathParameters.Key

  async function getUploadURL() {
  
    const s3Params = {
      Bucket: process.env.BUCKET_NAME,
      Key: Key,
      Expires: 60
    }
  
    console.log('Params: ', s3Params)
  
    const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params)
  
    return {
      uploadURL: uploadURL,
      Key: Key
    }
  }

  const URL = await getUploadURL();

  console.log('Message: ', URL)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      status: 200,
      message: URL
    })
  }
};
