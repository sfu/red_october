const ping = require('./ping');

module.exports = function(url, timeout, publishers) {
  const pings = publishers.map(function(p) {
    const options = timeout ? { timeout: parseInt(timeout) } : {};
    return ping(p + url, options).then(function(response) { return response; }).catch(function(error) { return error; });
  });

  return Promise.all(pings).then(function(responses) {
    const json = { successes: [], failures: []};
    responses.forEach(function(response) {
      if (response instanceof Error) {
        json.failures.push(response.message);
      } else {
        json.successes.push(response);
      }
    });
    return json;
  });
};
