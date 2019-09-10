const http = require("http");
const doRequest = require("./request");
const querystring = require("querystring");

async function getBizs(params) {
  const options = {
    path: "/v3/businesses/search?" + querystring.stringify(params)
  };
  console.log(options);
  const bizsData = await doRequest(options);
  const bizDetails = bizsData.businesses;

  const promises = Object.keys(bizDetails).map(id => {
    options.path = `/v3/businesses/${bizDetails[id].id}/reviews`;
    console.log(options);
    return doRequest(options);
  });
  const reviews = await Promise.all(promises);

  const bizsDetails = Object.keys(reviews).map(id => {
    console.log(bizDetails[id].name);
    bizDetails[id].reviews = reviews[id].reviews;
    return bizDetails[id];
  });
  return bizsDetails;
}

http
  .createServer((req, res) => {
    if (req.url == "/getBizs") {
      const params = {
        term: "Ice Cream",
        location: "Alpharetta GA",
        categories: "icecream",
        locale: "en_US",
        sort_by: "rating",
        limit: "5"
      };
      getBizs(params).then(response => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(response));
        res.end();
      });
    } else {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.write("End points : /getBizs");
      res.end();
    }
  })
  .listen(5000, "127.0.0.1", () =>
    console.log("server started listening to 5000 port..")
  );
