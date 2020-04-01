const AWS = require("aws-sdk");

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION
});

exports.handler = async event => {
  const timestamp = new Date().getTime();

  const putParams = {
    TableName: process.env.TableName,
    Item: {
      index: timestamp.toString(),
      createdAt: timestamp
    }
  };

  try {
    await ddb.put(putParams).promise();
  } catch (err) {
    return {
      statusCode: 500,
      body: "Failed to connect: " + JSON.stringify(err)
    };
  }

  return { statusCode: 200, body: "NICE!!!!!!!!!!!!!!" };
};

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION
});

exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  let data = JSON.parse(event.body);
  data.text = "sample data it is";

  if (typeof data.text !== "string") {
    console.error("Validation Failed");
    callback(null, {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Validation Error!!"
    });
    return;
  }

  const params = {
    TableName: process.env.TableName,
    Item: {
      text: data.text,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  };

  dynamoDb.put(params, error => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't create the todo item."
      });
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item)
    };
    callback(null, response);
  });
};
