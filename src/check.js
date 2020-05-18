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
  let {
    index,
    hash,
    previousHash,
    createdAt,
    tx_userId,
    tx_voiceHash,
    tx_timeStamp,
  } = event.queryStringParameters || {};

  if (
    !index ||
    !hash ||
    !previousHash ||
    !createdAt ||
    !tx_userId ||
    !tx_voiceHash ||
    !tx_timeStamp
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
      statusCode: 200,
      headers,
      body: JSON.stringify({ isCorrect: false, isLast: false }),
    };

  const isCorrect =
    get.Item.hash === hash &&
    get.Item.previousHash === previousHash &&
    get.Item.createdAt === parseInt(createdAt) &&
    get.Item.tx_userId === tx_userId &&
    get.Item.tx_voiceHash === tx_voiceHash &&
    get.Item.tx_timeStamp === parseInt(tx_timeStamp);

  const isLast = getNext.Item ? false : true;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ isCorrect, isLast }),
  };
};
