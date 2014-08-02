import Ember from 'ember';
import host from '../utils/host';

export default Ember.ObjectController.extend({
  path: function() {
    var that = this,
        id = that.get('id'),
        path = host.protocol + '://' + host.host + ':' + host.port + '/data/' + id + '/frames/'
    //Ex: "http://localhost:3000/data/fpolis-20140601U123121/frames/frame000.jpg"
    return path;
  }.property('id'),
});
