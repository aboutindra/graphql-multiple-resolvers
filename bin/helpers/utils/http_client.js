const axios = require('axios');
const curlirize = require('axios-curlirize');
curlirize(axios);

function sendRequest (method, baseUrl, route, params = null, headers = null, data = null) {
  return new Promise((resolve, reject) => {
    axios.request({
      method,
      url: baseUrl + route,
      data,
      params,
      headers
    }).then(async (result) => {
      resolve(result.data);
    }).catch(async (error) => {
      reject(error.response.data);
    });
  });
}

module.exports = { sendRequest };
