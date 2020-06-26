const querystring = require('querystring');


const parseQuery = (queryString) => {
  var query = {};
  if(queryString) {
      var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
      for (var i = 0; i < pairs.length; i++) {
          var pair = pairs[i].split('=');
          query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
      }
  }
  return query;
}

const parseBody = (body) => {
  const parsedBody = querystring.parse(body);
  if (parsedBody.payload) {
    return JSON.parse(parsedBody.payload);
  }
  return parsedBody;
}
  
  

module.exports = {
    parseQuery,
    parseBody
}