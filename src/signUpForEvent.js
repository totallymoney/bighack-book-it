const database = require('./db/database');
const messageFormatter = require('./utils/messageFormatter');
const requestParser = require('./utils/requestParser');

module.exports.handle = async function(event){
    console.log('Sign up Event', event);
    const {channel_name, user_name} = requestParser.parseQuery(event.body);

    // get event type
    const eventTypeDetails = await database.getEventTypeByChannelName(channel_name);
    if(!eventTypeDetails) {
      return messageFormatter.cannotFindEventForChannel();
    }

    // get event details 
    const activeEvent = await database.getActiveEvent(eventTypeDetails.id);
    if(!activeEvent) {
      return messageFormatter.noActiveEventForEventType(eventTypeDetails.title,eventTypeDetails.channel_name)
    }

    if(activeEvent.participants.includes(user_name)){
      return messageFormatter.alreadySignedUpForEvent(eventTypeDetails.title)
    }
    else {
      activeEvent.participants = [...activeEvent.participants, user_name];
      await database.upsertEvent(activeEvent);
      return messageFormatter.successfullySignedUpForEvent(eventTypeDetails,activeEvent);
    }
}