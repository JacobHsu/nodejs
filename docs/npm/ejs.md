# [ejs](https://github.com/mde/ejs)

Embedded JavaScript templates -- http://ejs.co  

[![NPM](https://nodei.co/npm/ejs.png?downloads=true&stars=true)](https://nodei.co/npm/ejs/)

https://github.com/mde/ejs > examples

app.js

```js
var express = require('express');
var path = require('path');
var ejs = require('ejs');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

function compileEjsTemplate(name, template) {
  const compiledTemplate = ejs.compile(template, {
    client: true,
    outputFunctionName: name
  });
  return function compileEjsTemplate(req, res, next) {
    res.locals.compiledEjsTemplates = res.locals.compiledEjsTemplates || {};
    res.locals.compiledEjsTemplates[name] = compiledTemplate.toString();
    return next();
  };
}

app.use(compileEjsTemplate('helloTemplate', 'Hello <%= include(\'messageTemplate\', { person: \'John\' }); %>'));

app.use('/', function(req, res) {
  return res.render('index', {});
});

app.listen(process.env.PORT || 3000);

```
