"use strict";

const AWS = require("aws-sdk");

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION
});

exports.hello = (event, context, callback) => {
  switch (event.httpMethod) {
    case "DELETE":
      sendResponse(200, "DELETE happened", callback);
      break;
    case "GET":
      sendResponse(200, "GET happened", callback);
      break;
    case "POST":
      sendResponse(200, "POST happened", callback);
      break;
    case "PUT":
      sendResponse(200, "PUT happened", callback);
      break;
    default:
      sendResponse(200, `Unsupported method "${event.httpMethod}"`, callback);
  }
};

function sendResponse(statusCode, message, callback) {
  const response = {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
  callback(null, response);
}

exports.handler = (event, context, callback) => {
  const done = (err, res) =>
    callback(null, {
      statusCode: err ? "400" : "200",
      body: err ? err.message : JSON.stringify(res),
      headers: {
        "Content-Type": "application/json"
      }
    });

  switch (event.httpMethod) {
    case "DELETE":
      dynamo.deleteItem(JSON.parse(event.body), done);
      break;
    case "GET":
      dynamo.scan({ TableName: event.queryStringParameters.TableName }, done);
      break;
    case "POST":
      dynamo.putItem(JSON.parse(event.body), done);
      break;
    case "PUT":
      dynamo.updateItem(JSON.parse(event.body), done);
      break;
    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`));
  }
};
