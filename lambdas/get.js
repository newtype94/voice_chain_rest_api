"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION
});

exports.handler = (event, context, callback) => {
  const params = {
    TableName: process.env.TableName,
    Key: {
      index: event.pathParameters.index
    }
  };

  const response = {
    statusCode: 200,
    body: "getResoponse"
  };
  callback(null, response);
  return;

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't fetch the todo item."
      });
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item)
    };
    callback(null, response);
  });
};
