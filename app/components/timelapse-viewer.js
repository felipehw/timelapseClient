import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['timelapse-viewer'],
  nPhotosLoaded: 0,
  nPhotoActual: null,
  nPhotoActualFtd: function(key, value) {
    var that = this,
        nPhotoActual;

    // setter
    if (arguments.length > 1) {
      that.set('nPhotoActual', value - 1);
    }
    //getter
    nPhotoActual = that.get('nPhotoActual');
    return nPhotoActual !== null ? nPhotoActual + 1 : null; //for template, not array's index
  }.property('nPhotoActual'),
  photoActualData: function() {
    return this.get('photos')[this.get('nPhotoActual')];
  }.property('nPhotoActual'),
  photoChangerSpeedInFps: 2,
  photoChangerSpeedInFpsMax: 20,
  photoChangerSpeedInFpsMin: 1,
  photoChangerSpeedInMsFtd: function() {
    var that = this,
        photoChangerSpeedInFps = window.parseFloat( that.get('photoChangerSpeedInFps') );
    return (1000/photoChangerSpeedInFps).toFixed(2);
  }.property('photoChangerSpeedInFps'),
  imgsElements: [],
  imgElementActual: null,
  isDownloadingPhotos: true, // starts 'true' for don't trigger 'getNewPhotos' before initial download in 'didInserElement'
  downloadPhotos: function() {
    var that = this,
        path = that.get('path'),
        photos = that.get('photos'),
        imgsElements = that.get('imgsElements'),
        img;

    var callDownloadIteratorRecursively = function() {
      Ember.run.later(that, function() {
        that.set('nPhotosLoaded', that.get('nPhotosLoaded') + 1);
        that.downloadPhotos();
      }, 100);
    };
    if ( that.get('nPhotosLoaded') < photos.length) {
      if ( !that.get('isDownloadingPhotos') ) {
        that.set('isDownloadingPhotos', true);
      }
      img = window.document.createElement('img');
      imgsElements.pushObject(img);
      img.addEventListener('load', callDownloadIteratorRecursively, false);
      img.src = path + photos[ that.get('nPhotosLoaded') ].filename;
      if ( !that.get('isChangeImgElementActualActive') && that.get('nPhotosLoaded') / photos.length > 0.1) {
        that.changeImgElementActual();
      }
    } else {
      that.set('isDownloadingPhotos', false);
    }
  },
  getNewPhotos: function() { //after the initial photo download, this observer detect new photos and get them
    var that = this;
    if ( that.get('nPhotosLoaded') < that.get('photos.length') && !that.get('isDownloadingPhotos') ) {
      that.downloadPhotos();
    }
  }.observes('nPhotosLoaded', 'photos.length', 'isDownloadingPhotos'),
  isChangeImgElementActualActive: false,
  changeImgElementActualLaterCall: null,
  changeImgElementActual: function() {
    var that = this;
    var imgElementChangerRecursive = function() {
      var imgsElements = that.get('imgsElements'),
          imgElementActual = imgsElements[that.get('nPhotoActual')] ?
                             imgsElements[that.get('nPhotoActual')] : imgsElements.get('firstObject'),
          imgElementNext,
          changeImgElementActualLaterCall;
      imgElementNext = imgsElements[imgsElements.indexOf(imgElementActual) + 1] !== undefined ?
                       imgsElements[imgsElements.indexOf(imgElementActual) + 1] : imgsElements.get('firstObject');
      that.$('.photo-container > img').replaceWith(imgElementNext);
      that.set('imgElementActual', imgElementNext );
      that.set('nPhotoActual', imgsElements.indexOf(imgElementNext) );
      if (that.get('isChangeImgElementActualActive') ) {
        changeImgElementActualLaterCall = Ember.run.later( that, imgElementChangerRecursive, that.get('photoChangerSpeedInMsFtd') );
        that.set('changeImgElementActualLaterCall', changeImgElementActualLaterCall);
      }
    };

    if (!that.get('isChangeImgElementActualActive') ) {
      that.set('isChangeImgElementActualActive', true);
      imgElementChangerRecursive();
    }
  },
  actions: {
    playTimelapse: function() {
      var that = this;
      that.changeImgElementActual();
    },
    pauseTimelapse: function() {
      var that = this;
      Ember.run.cancel( that.get('changeImgElementActualLaterCall') );
      that.set('isChangeImgElementActualActive', false);
    },
    stopTimelapse: function() {
      var that = this;
      that.set('nPhotoActual', 0);
      that.send('pauseTimelapse');
    },
  },
  didInsertElement: function() {
    var that = this;
        //element = that.$();
    that.downloadPhotos();
  }
});
