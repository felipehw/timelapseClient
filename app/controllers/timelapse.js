import Ember from 'ember';
import host from '../utils/host';

export default Ember.ObjectController.extend({
  path: function() {
    var that = this,
        id = that.get('id'),
        path = host.protocol + '://' + host.host + ':' + host.port + '/data/' + id + '/frames/';
    //Ex: "http://localhost:3000/data/fpolis-20140601U123121/frames/frame000.jpg"
    return path;
  }.property('id'),
  sockets: {
    // When EmberSockets makes a connection to the Socket.IO server.
    connect: function() {
      console.log('EmberSockets has connected...');
      //this.socket.emit('addme', this.get('nome') );
    },
    // When EmberSockets disconnects from the Socket.IO server.
    disconnect: function() {
      console.log('EmberSockets has disconnected...');
    },
    frame: function(dataForFrame) {
      var that = this,
          id = that.get('id'),
          photos = that.get('photos');
      var addOnlyFramesNotRepeated = function(newFrames, existentFrames) {
        newFrames.forEach(function (newFrame) {
          if (!existentFrames.findBy('filename', newFrame.filename) ) {
            existentFrames.addObject(newFrame);
          }
        });
      };

      console.log('New frame arrived for timelapse: ' + dataForFrame.id);
      if (dataForFrame.id === id) {
        addOnlyFramesNotRepeated(dataForFrame.photos, photos);
      }

    },
  },
});
