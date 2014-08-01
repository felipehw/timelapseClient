import Ember from 'ember';

var Router = Ember.Router.extend({
  location: TimelapseClientENV.locationType
});

Router.map(function() {
  this.resource('main', function() {
    this.resource('timelapses', function() {
      this.resource('timelapse', {path: ':id'});
    });
  });


});

export default Router;
