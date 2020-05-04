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
      body: "Insert parameters on url..",
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

  if (
    !index ||
    !hash ||
    !previousHash ||
    !createdAt ||
    !userId ||
    !voiceHash ||
    !timeStamp
  )
    return {
      statusCode: 400,
      headers,
      body: "At least one more parameter missed..",
    };

  let get, getNext;

  try {
    index = parseInt(index);
    get = await ddb.get({ TableName, Key: { index } }).promise();
    getNext = await ddb.get({ TableName, Key: { index: index + 1 } }).promise();
  } catch (err) {
    return {
      statusCode: err.statusCode || 501,
      headers,
      body: "error occured when Get from Dynamodb.." + JSON.stringify(err),
    };
  }

  if (!get.Item)
    return {
      statusCode: 400,
      headers,
      body: "No match with index..",
    };
  else get = get.Item;

  let checkResult;

  //isCorrect check
  if (
    get.hash === hash &&
    get.previousHash === previousHash &&
    get.createdAt === parseInt(createdAt) &&
    get.data.userId === userId &&
    get.data.voiceHash === voiceHash &&
    get.data.timeStamp === parseInt(timeStamp)
  )
    checkResult = { isCorrect: true };
  else checkResult = { isCorrect: false };

  //isLast check
  if (getNext.Item) checkResult.isLast = false;
  else checkResult.isLast = true;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(checkResult),
  };
};
