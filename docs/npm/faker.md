# faker.js

[faker.js](https://www.npmjs.com/package/faker) - generate massive amounts of fake data in the browser and node.js

[![NPM](https://nodei.co/npm/faker.png?downloads=true&stars=true)](https://nodei.co/npm/faker/)

```js
var faker = require('faker');

var randomName = faker.name.findName(); // Rowan Nikolaus
var randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
var randomCard = faker.helpers.createCard(); // random contact card containing many properties
console.log(randomName);
console.log(randomEmail);
console.log(randomCard);
```

<iframe height="400px" width="100%" src="https://repl.it/@JacobHsu/node-faker?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>
