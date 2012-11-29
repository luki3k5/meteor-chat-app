// create public channel if DB is empty
Meteor.startup(function () {
  if (Channels.find().count() === 0) {
    var channels_data = [ 
      {name: "Public Channel", private: false }, 
      {name: "Test Channel", private: false} 
    ];    

    for (var i = 0; i < channels_data.length; i++) {
      var channel_id = Channels.insert({name: data[i].name});
    }
  }
});
