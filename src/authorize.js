const axios = require('axios').default;

module.exports.handle = async (event, context) => {
    console.log('Authorize Event', event);

    // THIS FUNCTION IS REQUIRED FOR OTHER SLACK ACCOUNTS INSTALLATION. WE DON'T NEED IT FOR NOW. ITS NOT WORKING YET
    const clientId = process.env.SLACK_CLIENT_ID;
    const clientSecret = process.env.SLACK_CLIENT_SECRET;
    const code = event.queryStringParameters.code;
    const oauthURL = `https://slack.com/api/oauth.access?clientId=${clientId}&clientSecret=${clientSecret}&code=${code}`

    console.log('URL', oauthURL);
    const authResponse = await axios.post(oauthURL)
    const response = {
        statusCode: 200,
        body: JSON.stringify({token: authResponse.access_token})
    }
    return response;
}