//NPM Note: https://www.npmjs.org/package/node-uuid

var uuid = require('node-uuid');

// Generate a v1 (time-based) id
var id= uuid.v1(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a'
console.log(id);