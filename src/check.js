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
  if (!event.queryStringParameters)
    return {
      statusCode: 400,
      headers,
      body: "insert parameter on url..",
    };

  let {
    index,
    userId,
    voiceHash,
    timeStamp,
    hash,
    previousHash,
    createdAt,
  } = event.queryStringParameters;

  if (!index || !userId || !voiceHash || !timeStamp)
    return {
      statusCode: 400,
      headers,
      body: "check your parameters on url..",
    };

  let gets, getsNext;

  try {
    index = parseInt(index);
    gets = await ddb.get({ TableName, Key: { index } }).promise();
    getsNext = await ddb
      .get({ TableName, Key: { index: index + 1 } })
      .promise();
  } catch (err) {
    return {
      statusCode: err.statusCode || 501,
      headers,
      body: "error occured when Get from Dynamodb.." + JSON.stringify(err),
    };
  }

  if (authorize.length !== 1)
    return {
      statusCode: 400,
      headers,
      body: "No match with index..",
    };

  let body;

  if (hash && previousHash && createdAt) {
    if (
      gets.hash === hash &&
      gets.previousHash === previousHash &&
      gets.createdAt === parseInt(createdAt) &&
      gets.data.userId === userId &&
      gets.data.voiceHash === voiceHash &&
      gets.data.timeStamp === parseInt(timeStamp)
    )
      body = "block success";
    else body = "block fail";
  } else {
    if (
      gets.data.userId === userId &&
      gets.data.voiceHash === voiceHash &&
      gets.data.timeStamp === parseInt(timeStamp)
    )
      body = "data success";
    else body = "data fail";
  }

  return {
    statusCode: 200,
    headers,
    body,
  };
};
