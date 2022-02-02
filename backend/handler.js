"use strict";

const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION })
const s3 = new AWS.S3({
  signatureVersion: 'v4',
})

module.exports.run = async (event) => {

  if(event.pathParameters == null) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing Key"
      })
    }
  }

  const Key = event.pathParameters.Key

  // TODO: Check if file exist. If exist, return error do not allow overwrite

  async function getUploadURL() {
  
    const s3Params = {
      Bucket: process.env.BUCKET_NAME,
      Key: Key,
      Expires: Number(process.env.URL_EXPIRATION_SECONDS)
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
