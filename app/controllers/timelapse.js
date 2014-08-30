import Ember from 'ember';
import host from '../utils/host';

export default Ember.ObjectController.extend({
  isWebSocketConnectionActive: false,
  anyPhotosHaveDate: function(photos) {
    return photos.any(function(photo) {
      return photo.date;
    });
  },
  startTimeFtd: function() {
    var that = this,
        firstPhotos = that.get('photos').slice(0, 5), // só as 1ras fotos (por performance)
        startTimeFtd = null;
    var getFirstDateOfPhotos = function(photo) {
      if (photo.date) {
        if (!startTimeFtd) { startTimeFtd = photo.date; }
        else { startTimeFtd = photo.date < startTimeFtd ? photo.date : startTimeFtd; }
      }
    };

    if ( that.anyPhotosHaveDate(firstPhotos) ) {
      firstPhotos.forEach(getFirstDateOfPhotos, that);
    } else {
      startTimeFtd = that.get('startTime');
    }
    return startTimeFtd;
  }.property('photos.@each.date', 'startTime'),
  endTimeFtd: function() {
    var that = this,
        lastPhotos = that.get('photos').slice(-5), // só as últimas fotos (por performance)
        endTimeFtd = null;
    var getLastDateOfPhotos = function(photo) {
      if (photo.date) {
        if (!endTimeFtd) { endTimeFtd = photo.date; }
        else { endTimeFtd = photo.date > endTimeFtd ? photo.date : endTimeFtd; }
      }
    };

    if ( that.anyPhotosHaveDate(lastPhotos) ) {
      lastPhotos.forEach(getLastDateOfPhotos, that);
    } else {
      endTimeFtd = that.get('endTime');
    }
    return endTimeFtd;
  }.property('photos.@each.date', 'endTime'),
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
      this.set('isWebSocketConnectionActive', true);
      console.log('EmberSockets has connected...');
      //this.socket.emit('addme', this.get('nome') );
    },
    // When EmberSockets disconnects from the Socket.IO server.
    disconnect: function() {
      this.set('isWebSocketConnectionActive', false);
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
