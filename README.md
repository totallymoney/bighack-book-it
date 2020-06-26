# bighack-book-it
Booking system for our internal events 

APP 'book-it' is installed in TotallyMoney Slack Account. It allows you to book any event that requires waiting list and bigger group of people. You can set up new event type by goinig to DynamoDb (stage-BigHack-Book-It-EventTypes
 table) and adding the following entry (sample for football):

 {
  "channel_name": "tmp-football-channel",
  "channel_web_hook": "https://hooks.slack.com/services/<SOME ID>/<SOME ID>/<SOME ID>",
  "description": "Weekly football event",
  "id": "football",
  "image_url": "https://source.unsplash.com/featured/?soccer,team,goal",
  "team_domain": "totallymoney",
  "title": "TM Football"
} 

then you can perform 3 actions in the event channel (#tmp-football-channel in this case):
1. `/create-event` - set up new event of the kind (there can be only one active event per event type) - EVENT TIME IS IN UTC WHICH IS 1 HOUR EARLIER THAN UK TIME!!! 
2. `/in` - join the event
3. `/out` - leave the event you joined before


TODO: 
- FIX TIMES. ENSURE EVERYTHING WORKS IN GMT. 
- OPTIONALLY - MOVE EVENT CREATION FORM FROM ZAPIER TO SLACK SO IT'S EASIER TO USE
- SECURTY CONCERNS
- ADD FUNCTIONALITY TO BOOK INDIVIDUAL TIME SLOTS , LIKE FOR MESSAGE : `/in 1,2,5 , where 1,2,5 represents numbers of slots you are free for. Then the picking algorithm would choose the best list of people ensuring the most places are taken and most people are happy :) 


deployment : sls deploy
will deploy stage version to `tmhackday` aws profile from your computer.