import Ember from 'ember';
import ic from 'ic-ajax';
import host from '../utils/host';

export default Ember.Route.extend({
  model: function() {
    return ic(host.url + 'timelapses');
  }
});
