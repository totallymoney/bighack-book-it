const messageFormatter = require('./utils/messageFormatter');
const database = require('./db/database');
const axios = require('axios').default;
const slackBotToken = process.env.SLACK_BOT_TOKEN;
const requestParser = require('./utils/requestParser');

module.exports.handle = async function(event,context){

  const parsedBody = requestParser.parseBody(event.body);
  const {channel_name} = requestParser.parseQuery(event.body);

  // get event type
  const eventTypeDetails = await database.getEventTypeByChannelName(channel_name);
  if(!eventTypeDetails) {
    return messageFormatter.cannotFindEventForChannel();
  }

  // get event details 
  const activeEvent = await database.getActiveEvent(eventTypeDetails.id);
  if(activeEvent) {
    return messageFormatter.httpWrapper(200, { message: "event with this event type is already ongoing"})
  }
  // opening modal
  await axios.post('https://slack.com/api/views.open',{
    "trigger_id": parsedBody.trigger_id,
    "view": messageFormatter.newEventForm(eventTypeDetails)
  },{
    headers: { Authorization: `Bearer ${slackBotToken}` }
  });
  // empty 200 response
  return messageFormatter.httpWrapper(200);
}
