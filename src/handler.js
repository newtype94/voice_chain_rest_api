"use strict";

// apigateway 에서 호출시 진입점(hello)
exports.hello = (event, context, callback) => {
  //console.log('Received event:', JSON.stringify(event, null, 2));

  switch (event.httpMethod) {
    case "DELETE":
      sendResponse(200, "DELETE happened", callback);
      break;
    case "GET":
      sendResponse(200, "GET happened", callback);
      break;
    case "POST":
      sendResponse(200, "POST happened", callback);
      break;
    case "PUT":
      sendResponse(200, "PUT happened", callback);
      break;
    default:
      sendResponse(200, `Unsupported method "${event.httpMethod}"`, callback);
  }
};

function sendResponse(statusCode, message, callback) {
  const response = {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
  callback(null, response);
}
