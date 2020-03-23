# node-fetch

[![NPM](https://nodei.co/npm/node-fetch.png?downloads=true&stars=true)](https://nodei.co/npm/node-fetch/)

```js
const fetch = require("node-fetch");

fetch('https://api.github.com/users/github')
    .then(res => res.json())
    .then(json => console.log(json));
```

<iframe height="400px" width="100%" src="https://repl.it/@JacobHsu/node-fetch?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>
