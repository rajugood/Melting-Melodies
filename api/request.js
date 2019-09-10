const https = require("https");
const config = require("./config");

module.exports = function(params) {
  const options = {
    hostname: params.hostname || config.hostname,
    path: params.path || encodeURI(config.path),
    method: params.method || config.method,
    headers: {
      Authorization: params.api_token || "Bearer " + config.api_token
    }
  };
  return new Promise(function(resolve, reject) {
    const req = https
      .request(options, res => {
        const { statusCode } = res;

        if (statusCode !== 200) {
          console.log(options);
          let error = new Error(`Request Failed. Status Code: ${statusCode}`);
          res.resume();
          return reject(error);
        }

        res.setEncoding("utf8");
        let rawData = "";
        res.on("data", chunk => {
          rawData += chunk;
        });
        res.on("end", () => {
          try {
            const parsedData = JSON.parse(rawData);
            resolve(parsedData);
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", e => {
        reject(e);
      });

    req.end();
  });
};
