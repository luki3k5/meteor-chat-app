Messages = new Meteor.Collection("messages");
Channels = new Meteor.Collection("channels");

Session.set('channel_id', null);

//Meteor.subscribe("messages")
Meteor.subscribe("channels", function () {
  if(!Session.get('channel_id')){
    var channel = Channels.findOne({}, {sort: {name: 1}});
    if (channel)
      ChattyRouter.setChannel(channel._id);
  }
});

Template.channel.events({
  'mousedown .channel-box': function (evt) { // select list
    ChattyRouter.setChannel(this._id);
  },
  'click .channel-box': function (evt) {
    // prevent clicks on <a> from refreshing the page.
    evt.preventDefault();
  }
});

Template.channel.selected = function () {
  return Session.equals("channel_id", this._id) ? "selected" : '';
};

// resubscribe to messages based on the current channel
Meteor.autosubscribe(function () {
  var channel_id = Session.get('channel_id');
  if (channel_id)
    Meteor.subscribe('messages', channel_id);
});

// returning collection of channels to the template
Template.chatty.channels = function(){
  return Channels.find({private: false});
};

Template.chatty.messages = function () {
  var channel_id = Session.get('channel_id');
  if (!channel_id)
    return {};

  return Messages.find({channel_id: channel_id}, {sort: {timestamp: 1}});
};

// finding the owner of the message
Template.message.name = function () {
  return Meteor.user().emails[0].address
};

// when message template renders (on message arrival)
// animate the scroll to display it
Template.message.rendered = function(){
  container = $(".current-channel-messages")
  container.animate({ scrollTop: container.prop("scrollHeight") - container.height() + 100 }, 100);      
};

Template.chatty.events({
  'submit #new_message': function(event){
    event.preventDefault();
    username = Meteor.user().emails[0].address;

    Messages.insert({
      text: $('#new_message_text').val(), 
      timestamp: (new Date()).toTimeString(),
      username: username,
      gravatar: "http://www.gravatar.com/avatar/" + calcMD5(username) + "?s=64",
      channel_id: Session.get("channel_id")
    });
    $("#new_message_text").val("");
    container = $(".current-channel-messages")
    container.animate({ scrollTop: container.prop("scrollHeight") - container.height() + 100 }, 100);      
  }
});

// ------ ROUTING thru Backbone ------

var Router = Backbone.Router.extend({
  routes: {
    ":channel_id": "channels"
  },
  channels: function (channel_id) {
    Session.set("channel_id", channel_id);
  },
  setChannel: function (channel_id) {
    this.navigate(channel_id, true);
  }
});

ChattyRouter = new Router;

Meteor.startup(function () {
  Backbone.history.start({pushState: true});
});
