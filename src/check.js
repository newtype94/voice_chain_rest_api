"use strict";

const AWS = require("aws-sdk");

const { TableName } = process.env;

const headers = {
  "Content-Type": "text/plain",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "*",
};

exports.handler = async (event) => {
  const ddb = new AWS.DynamoDB.DocumentClient({
    apiVersion: "2012-08-10",
    region: process.env.AWS_REGION,
  });

  const input = JSON.parse(event.body);
  /*
  if (
    typeof input.userId !== number ||
    typeof input.voiceHash !== string ||
    typeof input.timeStamp !== number
  )
    return {
      statusCode: 400,
      headers,
      body: "Invalid type of input..",
    };
*/
  const createdAt = new Date().getTime();

  let puts;
  let scans;

  try {
    puts = await ddb
      .put({
        TableName,
        Item: input,
      })
      .promise();
    scans = await ddb.scan({ TableName }).promise();
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
    body: JSON.stringify(puts) + "\n\n" + JSON.stringify(scans),
  };
};
