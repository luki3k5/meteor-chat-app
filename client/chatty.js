Messages = new Meteor.Collection("messages");

Meteor.subscribe("messages")

  Template.chatty.messages = function(){
    return Messages.find({});
  };

  Template.message.name = function () {
    return Meteor.user().emails[0].address//.findOne(this.owner);
  };

  Template.message.rendered = function(){
    container = $(".container-fluid")
    container.animate({ scrollTop: container.prop("scrollHeight") - container.height() + 100 }, 100);      
  };

  Template.chatty.events({
    'submit #new_message': function(event){
      event.preventDefault();
      Messages.insert({
        text: $('#new_message_text').val(), 
        timestamp: (new Date()).toTimeString(),
        username: Meteor.user().emails[0].address
      });
      $("#new_message_text").val("");
      container = $(".container-fluid")
      container.animate({ scrollTop: container.prop("scrollHeight") - container.height() + 100 }, 100);      
    }
  });
