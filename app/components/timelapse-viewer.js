import Ember from 'ember';

export default Ember.Component.extend({
  nPhotosLoaded: 0,
  nPhotoActual: 0,
  photoChangerSpeed: 500,
  imgsElements: [],
  imgElementActual: undefined,
  didInsertElement: function() {
    var that = this,
        //element = that.$(),
        path = that.get('path'),
        photos = that.get('photos'),
        imgsElements = that.get('imgsElements');

    var isChangeImgElementActualActive = false;
    var changeImgElementActual = function() {
      var imgElementActual = that.get('imgElementActual');
      var imgElementNext = imgsElements[imgsElements.indexOf(imgElementActual) + 1] !== undefined ?
                           imgsElements[imgsElements.indexOf(imgElementActual) + 1] : imgsElements.get('firstObject');
      that.$('div.photo-container > img').replaceWith(imgElementNext);
      that.set('imgElementActual', imgElementNext );
      that.set('nPhotoActual', imgsElements.indexOf(imgElementNext) );
      Ember.run.later( this, changeImgElementActual, that.get('photoChangerSpeed') );
    };

    var downloadIterator = function() {
      var callDownloadIteratorRecursively = function() {
        Ember.run.later(this, function() {
          that.set('nPhotosLoaded', that.get('nPhotosLoaded') + 1);
          downloadIterator();
        }, 100);
      };
      if ( that.get('nPhotosLoaded') < photos.length) {
        var img = window.document.createElement('img');
        imgsElements.pushObject(img);
        img.addEventListener('load', callDownloadIteratorRecursively, false);
        img.src = path + photos[ that.get('nPhotosLoaded') ].filename;
        if ( !isChangeImgElementActualActive && that.get('nPhotosLoaded') / photos.length > 0.1) {
          isChangeImgElementActualActive = true;
          changeImgElementActual();
        }
      }
    };

    downloadIterator();
  }
});
