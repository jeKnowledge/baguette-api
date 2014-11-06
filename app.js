var express = require('express');
var fs = require('fs');
var app = express();
var request = require('request');

var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomNumberOfTypes = function (nTypes) {
  // exponential distribution to get fewer types more often
  return nTypes * (Math.exp(-Math.random()) - Math.exp(-1)) / (1 - Math.exp(-1));
};

var getRandomElementFromArray = function (items) {
  var index = Math.floor(Math.random() * items.length);
  return { name: items[index], index: index };
};

var baguetteTypes = ['Omolete', 'Atum', 'Frango', 'Delícias do mar',
                     'Salsicha', 'Salsicha com queijo', 'Lombo',
                     'Mista', 'Presunto', 'Queijo'];

var baguetteExtras = ['Ketchup', 'Alface', 'Milho', 'Tomate', 'Maionese',
                      'Cenoura', 'Cebola', 'Pepino', 'Mostarda', 'Ovo'];

app.get('/', function (req, res) {
  request('http://randombaguette.herokuapp.com/api', function (error, response, body) {
    var baguette = JSON.parse(body);

    res.write("<p>Tipo: ");
    res.write(baguette.type);
    res.write("</p>");

    res.write("<ul>");

    for (var i = 0; i < baguette.extras.length; i++) {
      res.write("<li>" + baguette.extras[i] + "</li>");
    }

    res.write("</ul>");

    res.end();
  });
});

app.get('/api', function (req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

  var baguetteExtrasCopy = baguetteExtras.slice(0);
  var type = getRandomElementFromArray(baguetteTypes).name;
  var howManyExtras = getRandomNumberOfTypes(baguetteExtrasCopy.length);
  var extras = [];

  for (var i = 0; i < howManyExtras; i++) {
    var newExtra = getRandomElementFromArray(baguetteExtrasCopy);

    if (newExtra.index > -1) {
      baguetteExtrasCopy.splice(newExtra.index, 1);
    }

    extras.push(newExtra.name);
  }

  res.end(JSON.stringify( { type: type , extras: extras} ));
});

var port = Number(process.env.PORT || 3000);

var server = app.listen(port, function () {
  console.log('Listening on port ' + port);
});
