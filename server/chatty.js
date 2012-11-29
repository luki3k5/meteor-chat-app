Messages = new Meteor.Collection("messages");
Channels = new Meteor.Collection("channels");

Meteor.publish('messages', function (channel_id) {
  return Messages.find({channel_id: channel_id});
});

Meteor.publish('channels', function() {
  return Channels.find({});
});
