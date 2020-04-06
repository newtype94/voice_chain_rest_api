"use strict";

const AWS = require("aws-sdk");

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION
});

exports.delete = (event, context, callback) => {
  const params = {
    TableName: process.env.TableName,
    Key: {
      id: event.pathParameters.id
    }
  };

  try {
    await ddb.delete(params).promise();
  } catch (err) {
    return {
      statusCode: error.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: "can't remove item: " + JSON.stringify(err)
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: "SUCCESS"
  };
};
