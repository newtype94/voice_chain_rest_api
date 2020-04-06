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
    body: "good connect"
  };
  callback(null, response);
}