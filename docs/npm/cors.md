# cors

[![NPM](https://nodei.co/npm/cors.png?downloads=true&stars=true)](https://nodei.co/npm/cors/)

## Access-Control-Allow-Origin

!> Access to XMLHttpRequest at 'https://vue-ele-server.herokuapp.com/api/seller' from origin 'https://jacobhsu.github.io' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

現在架大型網站經常是前後端拆開在不同 server，如此前端在 ajax 時就需要特別注意，
因為像 Express 預設就會是 `mode: no-cors` 非同網域不能獲取資源。

Express 官方自己出了一個套件 [`cors`](https://github.com/expressjs/cors) 方便大家在 Node.js 上設定 CORS

[Vue.js + Node.js + OpenAPI 帶你一次了解 CORS 跨域請求](https://medium.com/@moojing/vue-js-node-js-openapi-帶你一次了解cors跨域請求-b37cd926551f)

## Usage

Simple Usage (Enable All CORS Requests)

```js
var express = require('express')
var cors = require('cors')
var app = express()
 
app.use(cors())
 
app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})
 
app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})
```

Enable CORS for a Single Route

```js
const express = require('express')
const cors = require('cors')
const app = express()

const appData = require('./data.json')
const seller = appData.seller

const router = express.Router()

router.get('/seller', cors(), function (req, res) {
  res.json({
    errno: 0,
    data: seller
  })
})
```
