import Ember from 'ember';
import ic from 'ic-ajax';
import host from '../utils/host';

export default Ember.Route.extend({
  model: function(params) {
    return ic({ url: host.url + 'timelapses/' + params.id + '/photos',
                data: { detailed: true }, });
  }
});
