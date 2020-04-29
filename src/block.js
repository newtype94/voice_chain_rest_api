"use strict";

const AWS = require("aws-sdk");

const { TableName } = process.env;

const headers = {
  "Content-Type": "text/plain",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "*",
};

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
});

exports.handler = async (event) => {
  let scans;
  const { index } = event.queryStringParameters;

  const params = {
    TableName,
    ProjectionExpression: "*",
  };

  if (index > 0) {
    params.FilterExpression = "#idx = between :start and :end";
    params.ExpressionAttributeNames = {
      "#idx": "index",
    };
    params.ExpressionAttributeValues = {
      ":start": index,
      ":end": index,
    };
  }

  if (event.httpMethod === "GET") {
    try {
      scans = await ddb.scan(params).promise();
    } catch (err) {
      return {
        statusCode: err.statusCode || 501,
        headers,
        body: "Failed to connect: " + JSON.stringify(err),
      };
    }
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(scans) + JSON.stringify(event),
    };
  } else if (event.httpMethod === "POST") {
  }
};
