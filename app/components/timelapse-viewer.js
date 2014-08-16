import Ember from 'ember';

export default Ember.Component.extend({
  nPhotosLoaded: 0,
  nPhotoActual: null,
  nPhotoActualFtd: function() {
    var nPhotoActual = this.get('nPhotoActual');
    return nPhotoActual !== null ? nPhotoActual + 1 : null; //for template, not array's index
  }.property('nPhotoActual'),
  photoChangerSpeed: 500,
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
  changeImgElementActual: function() {
    var that = this;
    var imgElementChangerRecursive = function() {
      var imgsElements = that.get('imgsElements'),
          imgElementActual = that.get('imgElementActual'),
          imgElementNext;
      imgElementNext = imgsElements[imgsElements.indexOf(imgElementActual) + 1] !== undefined ?
                       imgsElements[imgsElements.indexOf(imgElementActual) + 1] : imgsElements.get('firstObject');
      that.$('div.photo-container > img').replaceWith(imgElementNext);
      that.set('imgElementActual', imgElementNext );
      that.set('nPhotoActual', imgsElements.indexOf(imgElementNext) );
      Ember.run.later( that, imgElementChangerRecursive, that.get('photoChangerSpeed') );
    };
    if (!that.get('isChangeImgElementActualActive') ) {
      that.set('isChangeImgElementActualActive', true);
      imgElementChangerRecursive();
    }
  },
  didInsertElement: function() {
    var that = this;
        //element = that.$();
    that.downloadPhotos();
  }
});
