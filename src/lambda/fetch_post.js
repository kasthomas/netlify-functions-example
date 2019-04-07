import querystring from "querystring";
import fetch from "node-fetch";

const API_ENDPOINT = "http://api.plos.org/search?q=";

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // When the method is POST, the topic will not be in the event’s
  // queryStringParameters – it’ll be in the event body encoded as a query string
  const params = querystring.parse(event.body);
  const topic = params.topic || "DNA";
  var myQuery = encodeURI('title:' + params.topic + '&fl=id,abstract&wt=json&indent=on');
  var url = API_ENDPOINT + myQuery;
  
  return fetch(url)
    .then(response => response.json())
    .then(data => ({
      statusCode: 200,
      body: JSON.stringify(data).indexOf('"numFound":0')!=-1? 
        "The url that failed was:\n" + url :  JSON.stringify(data)
    }))
    .catch(error => ({ statusCode: 422, body: String(error) }));
};
