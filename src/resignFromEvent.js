
const database = require('./db/database');
const messageFormatter = require('./utils/messageFormatter');
const requestParser = require('./utils/requestParser');

module.exports.handle = async function(event) {
  console.log('Resign Event', event.body);
  const {channel_name, user_name} = requestParser.parseQuery(event.body);

  // get event type
  const eventTypeDetails = await database.getEventTypeByChannelName(channel_name);
  if(!eventTypeDetails) {
    return messageFormatter.cannotFindEventForChannel();
  }
  
  // get event details 
  const activeEvent = await database.getActiveEvent(eventTypeDetails.id);
  if(!activeEvent) {
    return messageFormatter.noActiveEventForEventType(eventTypeDetails.title,eventTypeDetails.channel_name);
  }

  if(!activeEvent.participants.includes(user_name)){
    return messageFormatter.removeFromWaitingListNotSignedUp(eventTypeDetails.title);
  }
  else {
    const selectionDate = new Date(activeEvent.event_date);
    selectionDate.setDate(selectionDate.getDate() - activeEvent.selection_period_days);
    if(new Date() > selectionDate)
    {
      // penalty!
      activeEvent.penalties_for_resignation = [...activeEvent.penalties_for_resignation.filter(p => p !== user_name), user_name];
      activeEvent.participants = [...activeEvent.participants.filter(p => p !== user_name)];
      await database.upsertEvent(activeEvent);
      return messageFormatter.removeFromWaitingListWithPenatly(eventTypeDetails.title);
    }
    else{
      // no penalty
      activeEvent.participants = [...activeEvent.participants.filter(p => p !== user_name)];
      await database.upsertEvent(activeEvent);
      return messageFormatter.removeFromWaitingList(eventTypeDetails.title);
    }
    
  }
}