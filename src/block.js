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
  if (event.httpMethod === "GET") {
    let params = {
      TableName,
      ProjectionExpression:
        "#idx, #hs, previousHash, createdAt, tx_userId, tx_voiceHash, tx_timeStamp",
      ExpressionAttributeNames: {
        "#idx": "index",
        "#hs": "hash",
      },
    };

    if (event.queryStringParameters) {
      const { index, start } = event.queryStringParameters;
      if (index) {
        params.FilterExpression = "#idx = :index";
        params.ExpressionAttributeValues = {
          ":index": parseInt(index),
        };
      } else if (start) {
        params.FilterExpression = "#idx >= :start";
        params.ExpressionAttributeValues = {
          ":start": parseInt(start),
        };
      }
    }

    let scans;

    try {
      scans = await ddb.scan(params).promise();
    } catch (err) {
      return {
        statusCode: err.statusCode || 501,
        headers,
        body: "Failed to connect" + JSON.stringify(err),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(scans),
    };
    //GET case end
    //------------
    //POST case start
  } else if (event.httpMethod === "POST") {
    try {
      await ddb
        .put({
          TableName,
          Item: JSON.parse(event.body),
          ConditionExpression: "attribute_not_exists(index)",
        })
        .promise();
    } catch (err) {
      return {
        statusCode: err.statusCode || 501,
        headers,
        body: "Failed to put.." + JSON.stringify(err),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: "successed",
    };
  }
};
