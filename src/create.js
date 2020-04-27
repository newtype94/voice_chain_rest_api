const AWS = require("aws-sdk");

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
});

const { TableName } = process.env;

exports.handler = async (event) => {
  const timestamp = new Date().getTime();

  const { data } = JSON.parse(event.body);

  /*
  if (typeof data.timestamp !== "string")
    return {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Validation Failed",
    };
  */

  let puts;
  let scans;

  try {
    puts = await ddb
      .put({
        TableName,
        Item: JSON.parse(data),
      })
      .promise();
    scans = await ddb.scan({ TableName }).promise();
  } catch (err) {
    return {
      statusCode: err.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: "Failed to connect: " + JSON.stringify(err),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(puts) + "," + JSON.stringify(scans),
  };
};
