// http://code.tutsplus.com/tutorials/ember-components-a-deep-dive--net-35551
import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(date, lang, format) {
  var formatedDate = date; // no caso de não formatar data, usa desformatada
  if ( typeof(lang) === "string") {
    window.moment.lang(lang);
  } else {
    window.moment.lang('pt-br');
  }
  if ( typeof(date) === "number" || typeof(date) === "string" ) {
    if (format === 'fromNow') {
      formatedDate = window.moment(date).fromNow();
    } else if (format === 'compact') {
      formatedDate = window.moment(date).format('DD/MM/YY HH:mm:ss');
    } else if (typeof(format) === "string") {
      formatedDate = window.moment(date).format(format);
    } else { // 'format' default eh 'literal'
      formatedDate = window.moment(date).format('LLL');
    }
  }
  return formatedDate;
});
