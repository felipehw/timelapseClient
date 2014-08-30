import { test, moduleFor } from 'ember-qunit';

import FormatDateHelper from 'timelapse-client/helpers/format-date';

module('helpers:format-date', "Unit - FormatDateHelper");

test("it exists", function(){
  var helper = FormatDateHelper._rawFunction;
  equal( typeof helper, 'function', 'Função do helper existe' );
});

test("funcionamento", function(){
  var helper = FormatDateHelper._rawFunction;
  var dia = 86400000;
  equal( helper( Date.now(), null, 'fromNow' ), 'segundos atrás', 'Renderizou corretamente "segundos atrás"' );
  equal( helper( Date.now() - dia, null, 'fromNow'), 'um dia atrás', 'Renderizou corretamente "um dia atrás"' );
  equal( helper( Date.now() - dia * 7, null, 'fromNow'), '7 dias atrás', 'Renderizou corretamente "7 dias atrás"' );
  equal( helper( Date.now(), 'en', 'fromNow' ), 'a few seconds ago', 'Renderizou corretamente "a few seconds ago", usando parâmetro p/ língua' );
  equal( helper( Date.now(), 'pt-br', 'fromNow' ), 'segundos atrás', 'Renderizou corretamente "segundos atrás", usando parâmetro p/ língua' );
});
