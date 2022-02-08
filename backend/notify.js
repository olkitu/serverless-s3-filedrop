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
const ses = new AWS.SES();

module.exports.run = async (event) => {
    const Bucket = event.Records[0].s3.bucket.name;
    const Key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

    const s3Params = {
        Bucket: Bucket,
        Key: Key,
        Expires: 604800
      }

    const url = await s3.getSignedUrl('getObject', s3Params);

    console.log('Signed URL generated: ' + url)

    var Sesparams = {
        Destination: {
            ToAddresses: [
                process.env.TO_ADDRESS
            ]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: 'Hello, This is notification from FileDrop service. New file '+ Key +' has been uploaded. <a href="' + url + '">Click here to download</a>'
                },
                Text: {
                    Charset: "UTF-8",
                    Data: 'Hello, This is notification from FileDrop service. New file '+ Key +' has been uploaded. ' + url
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: "New file has been uploaded"
            }
        },
        Source: process.env.FROM_ADDRESS
    }

    try {
        const result = await ses.sendEmail(Sesparams).promise();
        console.log(result);
    } catch (error) {
        console.log(error);
    }

}