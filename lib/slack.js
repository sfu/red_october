const request = require('request');

module.exports = {
  sendMessage: function(uri, json) {
    const postOptions = {
      uri: uri,
      json: json,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    request(postOptions, (error) => {
      if (error){
        throw new Error(error);
      }
    });
  }
};
