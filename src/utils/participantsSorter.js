

const gen = require('random-seed');

const sortParticipants = (event, allEvents) => {
    let waitingList = [...event.participants];
    const previousEvents = allEvents.filter(e => e.id !== event.id);
    previousEvents.sort((e1, e2) => e2.event_date - e1.event_date);
    const previousEvent = previousEvents.length > 0 ? previousEvents[0] : null;

    console.log('PREVIOUS EVENT: ', previousEvent);
    // return all if less or equal to max participants
    if(waitingList.length <= event.max_participants) {
        console.log('NO SORTNIG, TO LITTLE PARTICPANTS: ', event.participants);
        return event.participants;
    }


    waitingList.sort((userA, userB) => {
        return getParticipantScore(userB,event, previousEvent) - getParticipantScore(userA,event, previousEvent);
    })
    waitingList.forEach((user_name,index) => {
        console.log(`SCORE #${index}` , event.id , user_name, getParticipantScore(user_name,event, previousEvent));
    });
    return waitingList;
}

const getParticipantScore = (user_name,event, previousEvent) => {
    console.log('sortinig ', user_name,previousEvent);
    const randomValue = gen.create(event.id+user_name)(100)/100.0;

    //- 200% penalty for current game late resignation and sign up again
    if(event && event.penalties_for_resignation.indexOf(user_name) > -1) {
        return -200 + randomValue;
    }

    //- 100% penalty for last game late resignation
    if(previousEvent && previousEvent.penalties_for_resignation.indexOf(user_name) > -1) {
        return -100 + randomValue;
    }
    //+ 100% of attendance for signing up but not gettinig to previous event
    if(previousEvent 
        && previousEvent.participants.indexOf(user_name) > -1 
        && previousEvent.participants.indexOf(user_name) >= previousEvent.max_participants)
        {
            return 100 + randomValue;
        }
    //+ 50%
    else if(previousEvent && previousEvent.participants.indexOf(user_name) === -1) {
        return 50 + randomValue;
    }
    return randomValue;

}
module.exports = {
    sortParticipants
}