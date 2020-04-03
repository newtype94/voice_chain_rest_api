const AWS = require("aws-sdk");

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION
});

exports.handler = async event => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  /*
  if (typeof data.text == "string") {
    console.error("Validation Failed");
    callback(null, {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Validation Error!!"
    });
    return;
  }
  */

  const putParams = {
    TableName: process.env.TableName,
    Item: {
      index: timestamp.toString(),
      createdAt: timestamp
    }
  };

  let a;
  try {
    a = await ddb.put(putParams).promise();
    console.log(a);
  } catch (err) {
    return {
      statusCode: error.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: "Failed to connect: " + JSON.stringify(err)
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: "SUCCESS" + JSON.stringify(a)
  };
};
