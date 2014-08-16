import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';

import host from './utils/host';

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
  modulePrefix: 'timelapse-client', // TODO: loaded via config
  Resolver: Resolver,
  /* CONFIG p/ ember-sockets */
  Socket: window.EmberSockets.extend({
    host: host.host,
    port: host.port,
    controllers: ['timelapse'],
  })
  /* /CONFIG p/ ember-sockets */
});

loadInitializers(App, 'timelapse-client');

export default App;
