const AWS = require("aws-sdk");

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
});

exports.handler = async (event) => {
  const timestamp = new Date().getTime();

  /*
  const data = JSON.parse(event.body);

  if (typeof data.timestamp !== "string")
    return {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Validation Failed",
    };
  */

  const putParams = {
    TableName: process.env.TableName,
    Item: {
      index: timestamp.toString(),
      createdAt: timestamp,
    },
  };

  const getParams = {
    TableName: process.env.TableName,
  };

  let puts;
  let scans;

  try {
    puts = await ddb.put(putParams).promise();
    scans = await ddb.scan(getParams).promise();
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
